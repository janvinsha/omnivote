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


export default function Dao() {
    return (
        <div className="container relative">
            <PageHeader>
                {/* <Announcement /> */}
                <PageHeaderHeading>Explore DAOs</PageHeaderHeading>
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
