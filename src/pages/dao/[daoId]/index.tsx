import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { CardList } from "@/components/card-list";
import ApiWrapper from "@/lib/ApiWrapper";
import { useEffect, useState } from "react";
import { IProposal } from "@/model/proposal.model";
import { useRouter } from "next/router";
import { IDao } from "@/model/dao.model";
import AddressWithCopyButton from "@/components/address-with-copy-button";

export default function Proposal() {

    const [proposals, setProposals] = useState<IProposal[]>()
    const [dao, setDao] = useState<IDao>()
    const router = useRouter();
    const { daoId } = router.query;
    const [loading, setLoading] = useState(false)
    const apiw = ApiWrapper.create();

    const refreshDao = async () => {
        setLoading(true)
        try {
            if (daoId) {
                const data = await apiw.get(`dao/${daoId}`)
                const _dao = data.dao as any;
                setDao(_dao)
                if (_dao) {
                    await apiw.get(`proposal?daoId=${_dao?._id as string}`).then((data: any) => {
                        const _proposals = data.proposals as IProposal[];
                        setProposals(_proposals)
                    });
                }
            }
        } catch (error) {
            console.log("THIS IS THE ERROR", error)
        } finally {
            setLoading(false)
        }
    };


    useEffect(() => {
        refreshDao();
    }, []);


    const list = { name: `These are the Proposals in ${dao?.name}`, type: "proposal", items: proposals }

    return (
        <div className="px-2 md:container relative  pb-[10rem]">
            <PageHeader>
                <div className="flex justify-between w-full items-start" >
                    <PageHeaderHeading>Explore {dao?.name}</PageHeaderHeading>
                </div>
                <PageHeaderDescription>
                    <div className="flex gap-4 items-center md:flex-row flex-col">
                        <span className="mt-2 flex flex-col gap-2 md:w-[8rem] md:h-[8rem] rounded-lg w-full">
                            <img src={dao?.image} className="rounded-lg" />
                        </span>
                        <div className="flex flex-col gap-2 overflow-x-hidden">
                            <span className="flex flex-col gap-2 ">
                                <h2>{dao?.description} </h2>
                            </span>
                            <span className="flex flex-col gap-2 w-[20rem] overflow-hidden">
                                <AddressWithCopyButton address={dao?.ownerAddress as string} />
                            </span>
                        </div>
                    </div>
                </PageHeaderDescription>
            </PageHeader>
            <div>
                <CardList list={list} loading={loading} />
            </div>

        </div>

    );
}
