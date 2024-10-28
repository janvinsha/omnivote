import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"

import ApiWrapper from "@/lib/ApiWrapper";
import React, { useEffect, useState } from "react";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterSkeleton } from "@/components/filter-selector";

import { AttestationTable } from "@/components/attestation-table";
import { IVote } from "@/model/vote.model";



export default function Votes() {
    const [votes, setVotes] = useState()
    const [search, setSearch] = useState("");
    const apiw = ApiWrapper.create();
    const refreshVotesList = async () => {

        await apiw.get(`vote?voter=${search}`).then((data: any) => {
            const _votes: IVote[] = data?.votes;
            setVotes(_votes as any);
        });
    };

    useEffect(() => {
        refreshVotesList();
    }, [search]);

    const list = { name: "Votes", items: [{ name: "Propsal 1" }, { name: "Proposal 2" }, { name: "Propsal 1" }, { name: "Proposal 2" }, { name: "Propsal 1" }, { name: "Proposal 2" }] }

    return (
        <div className="px-2 md:container relative pb-[10rem]">
            <PageHeader>
                {/* <Announcement /> */}
                <div className="flex justify-between w-full items-start" >
                    <PageHeaderHeading>Query Votes</PageHeaderHeading>

                </div>
                <PageHeaderDescription>
                    Query Votes by the voters address
                </PageHeaderDescription>

            </PageHeader>


            <div>
                <div className="flex flex-col gap-10 rounded-lg shadow-sm ring-1 ring-border">

                    <div className="flex flex-col md:flex-row items-center p-2 pb-0">
                        <div className="flex-1 pl-4 text-lg font-medium py-4">
                            <h2 className="capitalize">{list?.name}</h2>
                        </div>

                        <React.Suspense fallback={<FilterSkeleton />}>
                            <div className="relative pr-2">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search" className="pl-8 w-60" onChange={(e) => setSearch(e.target.value)} />
                            </div>
                        </React.Suspense>
                    </div>

                    <div>
                        <AttestationTable items={votes || []} />
                    </div>
                </div>

            </div>

        </div>

    );
}
