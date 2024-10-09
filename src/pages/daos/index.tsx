import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"

import { CardList } from "@/components/card-list";
import { CreateDaoDialog } from "@/components/create-dao-dialog";
import ApiWrapper from "@/lib/ApiWrapper";
import { useEffect, useState } from "react";
import { IDao } from "@/model/dao.model";

export default function Dao() {
    const [daos, setDaos] = useState<IDao[]>()
    const [loading, setLoading] = useState(false)
    const apiw = ApiWrapper.create();
    const refreshDaoList = async () => {
        setLoading(true)
        try {
            await apiw.get('dao').then((data: any) => {
                console.log("THIS IS THE DAO", data)
                const daos = data.daos as IDao[];
                setDaos(daos)
            });
        } catch (error) {
            console.log("THIS IS THE ERROR", error)
        } finally { setLoading(false) }
    };

    useEffect(() => {
        refreshDaoList();
    }, []);

    const list = { name: "Daos", type: "dao", items: daos }
    return (
        <div className="container relative pb-[10rem]">
            <PageHeader>
                <div className="flex justify-between w-full items-start" >
                    <PageHeaderHeading>Explore DAOs</PageHeaderHeading>
                    <><CreateDaoDialog refreshList={refreshDaoList} /></>
                </div>
                <PageHeaderDescription>
                    Explore DAOs in OmniVote
                </PageHeaderDescription>

            </PageHeader>
            <div>
                <div>
                    <CardList list={list} loading={loading} />
                </div>
            </div>
        </div>

    );
}
