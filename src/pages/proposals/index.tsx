import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"

import { CardList } from "@/components/card-list";
import ApiWrapper from "@/lib/ApiWrapper";
import { useEffect, useState } from "react";
import { CreateProposalDialog } from "@/components/create-proposal-dialog";
import { IProposal } from "@/model/proposal.model";


export default function Proposal() {

    const [proposals, setProposals] = useState<IProposal[]>()
    const [loading, setLoading] = useState(false)
    const apiw = ApiWrapper.create();
    const refreshProposalList = async () => {
        setLoading(true)
        try {
            await apiw.get('proposal').then((data: any) => {
                const _proposals = data.proposals as IProposal[];

                setProposals(_proposals)
            });
        } catch (error) {
            console.log("THIS IS THE ERROR", error)
        } finally { setLoading(false) }
    };

    useEffect(() => {
        refreshProposalList();
    }, []);

    const list = { name: "Proposals", type: "proposal", items: proposals }

    return (
        <div className="container relative  pb-[10rem]">
            <PageHeader>
                {/* <Announcement /> */}
                <div className="flex justify-between w-full items-start" >
                    <PageHeaderHeading>Explore Proposals</PageHeaderHeading>
                    <><CreateProposalDialog refreshList={refreshProposalList} /></>
                </div>
                <PageHeaderDescription>
                    Explore Proposals in OmniVote
                </PageHeaderDescription>
            </PageHeader>
            <div>
                <CardList list={list} loading={loading} />
            </div>

        </div>

    );
}
