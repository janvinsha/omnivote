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
import { useEffect, useState } from "react";
import { SignProtocolAdapter } from "@/services/adapters/SignProtocol";
import { EvmChains } from "@ethsign/sp-sdk";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";



export default function Attestation() {
    const [attestations, setAttestations] = useState()
    const [search, setSearch] = useState("");
    const apiw = ApiWrapper.create();
    const refreshAttestationList = async () => {
        const signProtocol = new SignProtocolAdapter({ chain: EvmChains.sepolia })
        const _attestations = await signProtocol.getAllAttestations({ attester: search })
        console.log("THESE ARE THE ATTESTATIONS", _attestations)
    };

    useEffect(() => {
        refreshAttestationList();
    }, [search]);

    const list = { name: "Attestations", items: [{ name: "Propsal 1" }, { name: "Proposal 2" }] }

    return (
        <div className="container relative">
            <PageHeader>
                {/* <Announcement /> */}
                <div className="flex justify-between w-full items-start" >
                    <PageHeaderHeading>Query Attestations</PageHeaderHeading>

                </div>
                <PageHeaderDescription>
                    Query Attestations on Sign protocol by the attesters address
                </PageHeaderDescription>
                {/* <PageActions>
                    <Button asChild size="sm">
                        <Link href="/docs">Get Started</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                        <Link
                            target="_blank"
                            rel="noreferrer"
                            href={siteConfig.links.github}
                        >
                            GitHub
                        </Link>
                    </Button>
                </PageActions> */}
            </PageHeader>
            {/* <ExamplesNav className="[&>a:first-child]:text-primary" /> */}

            <div>
                <CardList list={list} navRightComponent={<div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <form>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search" className="pl-8 w-60" onChange={(e) => setSearch(e.target.value)} />
                        </div>
                    </form>
                </div>} />
            </div>

        </div>

    );
}
