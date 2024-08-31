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
import { useEffect } from "react";
import { CreateProposalDialog } from "@/components/create-proposal-dialog";


export default function Proposal() {
    const apiw = ApiWrapper.create();
    const refreshProposalList = async () => {
        await apiw.get('proposals').then((data: any) => {
        });
    };

    useEffect(() => {
        refreshProposalList();
    }, []);

    const list = { name: "Proposal", items: [{ name: "Propsal 1" }, { name: "Propsal 2" }] }

    return (
        <div className="container relative">
            <PageHeader>
                {/* <Announcement /> */}
                <div className="flex justify-between w-full items-start" >
                    <PageHeaderHeading>Explore Proposals</PageHeaderHeading>
                    <><CreateProposalDialog /></>
                </div>
                <PageHeaderDescription>
                    Explore Proposals in OmniVote
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
                <CardList list={list} />
            </div>

        </div>

    );
}
