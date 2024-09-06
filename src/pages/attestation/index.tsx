import Image from "next/image"
import Link from "next/link"
import { Inter } from "next/font/google";
import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { CardList } from "@/components/card-list";
import ApiWrapper from "@/lib/ApiWrapper";
import React, { useEffect, useState } from "react";
import { SignProtocolAdapter } from "@/services/adapters/SignProtocol";
import { EvmChains } from "@ethsign/sp-sdk";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FilterSkeleton } from "@/components/filter-selector";

import { AttestationTable } from "@/components/attestation-table";
import { IVote } from "@/model/vote.model";



export default function Attestation() {
    const [attestations, setAttestations] = useState()
    const [search, setSearch] = useState("");
    const apiw = ApiWrapper.create();
    const refreshAttestationList = async () => {
        // const signProtocol = new SignProtocolAdapter({ chain: EvmChains.sepolia })
        // const { rows } = await signProtocol.getAllAttestations({ attester: search })
        // setAttestations(rows);
        await apiw.get(`vote?attester=${search}`).then((data: any) => {
            const _votes: IVote[] = data?.votes;
            console.log("THIS IS THE PROPOSAL", _votes)
            setAttestations(_votes as any);
        });
    };

    useEffect(() => {
        refreshAttestationList();
    }, [search]);

    const list = { name: "Attestations", items: [{ name: "Propsal 1" }, { name: "Proposal 2" }, { name: "Propsal 1" }, { name: "Proposal 2" }, { name: "Propsal 1" }, { name: "Proposal 2" }] }

    return (
        <div className="container relative  pb-[10rem]">
            <PageHeader>
                {/* <Announcement /> */}
                <div className="flex justify-between w-full items-start" >
                    <PageHeaderHeading>Query Attestations</PageHeaderHeading>

                </div>
                <PageHeaderDescription>
                    Query Attestations on Sign protocol by the attesters address
                </PageHeaderDescription>

            </PageHeader>


            <div>
                <div className="flex flex-col gap-10 rounded-lg shadow-sm ring-1 ring-border">

                    <div className="flex items-center p-2 pb-0">
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
                        <AttestationTable items={attestations || []} />
                    </div>
                </div>

            </div>

        </div>

    );
}
