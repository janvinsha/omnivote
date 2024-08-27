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


export default function Home() {
  return (
    <div className="container relative">
      <PageHeader>
        {/* <Announcement /> */}
        <PageHeaderHeading>Cross-Chain Decentralized Voting</PageHeaderHeading>
        <PageHeaderDescription>
          Join the future of decentralized decision-making. Our cross-chain voting platform leverages LayerZero, Sign Protocol, and Tableland to ensure secure, transparent, and verifiable governance on any blockchain. Connect your wallet, explore proposals, and make your voice heard in the decentralized world.
        </PageHeaderDescription>
        <PageActions>
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
        </PageActions>
      </PageHeader>
      {/* <ExamplesNav className="[&>a:first-child]:text-primary" /> */}
      <section className="overflow-hidden rounded-lg border bg-background shadow-md md:hidden md:shadow-xl">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </section>
      <section className="hidden md:block">
        <div className="overflow-hidden rounded-lg border bg-background shadow">
          {/* <MailPage /> */}
        </div>
      </section>
    </div>

  );
}
