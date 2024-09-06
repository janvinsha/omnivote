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
import { useEffect, useState } from "react";
import { IProposal } from "@/model/proposal.model";
import { IDao } from "@/model/dao.model";
import ApiWrapper from "@/lib/ApiWrapper";
import { CardList } from "@/components/card-list";


export default function Home() {

  const [loading, setLoading] = useState(false)
  const apiw = ApiWrapper.create();
  const [proposals, setProposals] = useState<IProposal[]>()
  const [daos, setDaos] = useState<IDao[]>()

  const refreshDaoList = async () => {
    setLoading(true)
    try {
      await apiw.get('dao').then((data: any) => {
        console.log("THIS IS THE DAO", data)
        const _daos = data.daos as IDao[];
        const limitedDaos = _daos.slice(0, 4);
        setDaos(limitedDaos)
      });
    } catch (error) {
      console.log("THIS IS THE ERROR", error)
    } finally { setLoading(false) }
  };


  const refreshProposalList = async () => {
    setLoading(true);
    try {
      // Fetch proposals from the API
      await apiw.get('proposal').then((data: any) => {
        const _proposals = data.proposals as IProposal[];

        // Limit the proposals to the first 3
        const limitedProposals = _proposals.slice(0, 4);

        console.log("THIS IS THE PROPOSAL", limitedProposals);
        setProposals(limitedProposals);
      });
    } catch (error) {
      console.log("THIS IS THE ERROR", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProposalList();
    refreshDaoList();
  }, []);

  const proposalList = { name: "Explore recent proposals", type: "proposal", items: proposals }
  const daoList = { name: "These are our top Daos", type: "dao", items: daos }
  return (

    <div className="container relative pb-[10rem]">
      <PageHeader>
        <PageHeaderHeading>Cross-Chain Decentralized Voting</PageHeaderHeading>
        <PageHeaderDescription>
          Join the future of decentralized decision-making. Our cross-chain voting platform leverages Chainlink CCIP and Sign Protocol to ensure secure, transparent, and verifiable governance on any blockchain. Connect your wallet, explore proposals, and make your voice heard in the decentralized world.
        </PageHeaderDescription>
        <PageActions>
          <Button asChild size="sm">
            <Link href="/dao">Get Started</Link>
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
      <div className="flex flex-col gap-10">
        <CardList list={proposalList} loading={loading} />
        <CardList list={daoList} loading={loading} />
      </div>
    </div>

  );
}
