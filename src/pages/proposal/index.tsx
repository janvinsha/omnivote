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


export default function Proposal() {
    const apiw = ApiWrapper.create();
    const refreshProposalList = async () => {
        await apiw.get('proposals').then((data: any) => {
        });
    };

    useEffect(() => {
        refreshProposalList();
    }, []);

    return (
        <div className="container relative">
            <PageHeader>
                {/* <Announcement /> */}
                <PageHeaderHeading>Explore DAOs</PageHeaderHeading>
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
                <CardList />
            </div>

        </div>

    );
}
