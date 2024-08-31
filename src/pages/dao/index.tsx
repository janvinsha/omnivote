import Image from "next/image"
import Link from "next/link"
import { Inter } from "next/font/google";
import {
    PageActions,
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"

import { siteConfig } from "@/config/site";
import { CardList } from "@/components/card-list";
import { CreateDaoDialog } from "@/components/create-dao-dialog";
import ApiWrapper from "@/lib/ApiWrapper";
import { useEffect } from "react";

export default function Dao() {

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

                <div className="flex justify-between w-full items-start" >
                    <PageHeaderHeading>Explore DAOs</PageHeaderHeading>
                    <><CreateDaoDialog /></>
                </div>
                <PageHeaderDescription>
                    Explore DAOs in OmniVote
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
                <div>
                    <CardList />
                </div>
            </div>
        </div>

    );
}
