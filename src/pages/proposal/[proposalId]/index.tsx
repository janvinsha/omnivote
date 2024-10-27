import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import ApiWrapper from "@/lib/ApiWrapper";
import { useEffect, useState } from "react";
import { IProposal } from "@/model/proposal.model";
import { useRouter } from "next/router";
import { getChainId, getChainName, getChainSelectorCrossChain, getChainTokenName, getContractUrl, getVoteFee } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OmnivoteABI from "../../../data/abis/OmnivoteABI.json"
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { AttestationTable } from "@/components/attestation-table";
import { IVote } from "@/model/vote.model";
import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import ProgressButton from "@/components/progress-button";
import { useAccount } from 'wagmi'
import { switchChain, writeContract } from '@wagmi/core'
import { config } from "@/config/wagmiConfig";
import { ethers } from "ethers";

const imageUrl = "https://ipfs.io/ipfs/QmUUshcrtd7Fj4nMmYB3oYRDXcswpB2gw7ECmokcRqcNMf";
export default function ProposalDetails() {
    const router = useRouter();
    const { proposalId } = router.query;
    const [loading, setLoading] = useState(false);
    const [voteLoading, setVoteLoading] = useState("");
    const { toast } = useToast();
    const { address, chainId: connectedChainId } = useAccount()

    const [attestations, setAttestations] = useState()


    const [proposal, setProposal] = useState<any>()
    const [chainToVote, setChainToVote] = useState<string>()


    const apiw = ApiWrapper.create();
    const refreshProposal = async () => {
        setLoading(true)
        try {
            if (proposalId) {
                await apiw.get(`proposal/${proposalId}`).then((data: any) => {
                    const _proposal = data.proposal as IProposal;

                    setProposal(_proposal)
                });
            }
        } catch (error) {
            console.log("THIS IS THE ERROR", error)
        } finally {
            setLoading(false)
        }
    };

    const refreshVotesList = async () => {
        if (proposalId) {
            await apiw.get(`vote?proposalId=${proposalId}`).then((data: any) => {
                const _votes = data.votes as IVote[];

                setAttestations(_votes as any);
            });
        }
    };


    useEffect(() => {

        refreshProposal();
        refreshVotesList()

    }, [proposalId]);

    const handleChainSelect = (value: string) => {
        setChainToVote(value)
    }
    const handleVote = async (voteType: string, voteTypeId: number) => {

        if (!address) {
            toast({
                title: "Connect Wallet",
                description: "You need to connect your wallet to vote",
                duration: 2000,
            })
            return;
        }
        setVoteLoading(voteType)

        try {
            if (connectedChainId != getChainId(chainToVote as string)) {
                await switchChain(config, { chainId: getChainId(chainToVote as string) })
            }
            if (getChainId(chainToVote as string) == getChainId(proposal?.mainChain as string)) {

                await writeContract(config, {
                    abi: OmnivoteABI,
                    address: proposal?.mainChain as any,
                    functionName: 'submitVote',
                    args: [
                        proposal?.onChainID, voteTypeId
                    ],
                    value: ethers.parseEther(getVoteFee(proposal?.mainChain))
                })
            } else {
                await writeContract(config, {
                    abi: OmnivoteABI,
                    address: chainToVote as any,
                    functionName: 'submitVoteCrossChain',
                    args: [
                        getChainSelectorCrossChain(proposal?.mainChain as string), proposal?.mainChain as string, proposal?.onChainID as string, voteTypeId
                    ],
                    value: ethers.parseEther(getVoteFee(chainToVote as string))
                })
            }


            await apiw.put(`proposal/${proposal?._id as string}`, {
                totalVotes: Number(proposal?.totalVotes) + 1,
                votes: { ...proposal?.votes, [voteType]: ((proposal?.votes as any)?.[voteType] || 0) + 1 }
            })
            await apiw.post("/vote", {
                proposalId, voter: address, proposalAddress: proposal?.onChainID, voteType
            })

            toast({
                title: "Successfully voted on this protocol"
            })

            refreshProposal();
            refreshVotesList()
        }

        catch (error) {
            console.log("THIS IS THE ERROR", error)
            toast({
                title: "Error voting",
                variant: "destructive"
            })
        } finally {
            setVoteLoading("")
        }
    }

    const calculateVotePercentage = (voteType: 'yes' | 'no' | 'abstain') => {
        const totalVotes = Number(proposal.totalVotes);
        const type = Number(proposal.votes?.[voteType]) || 0
        const percentage = 100 * Number(type / totalVotes) || 0
        return Math.round(percentage)
    }

    return (
        <div className="px-2 md:container relative  pb-[10rem]">
            <PageHeader>
                <div className="flex justify-between w-full items-start" >
                    <PageHeaderHeading>Proposal Description</PageHeaderHeading>
                </div>
                <PageHeaderDescription>
                    Get into the details of this Proposals in OmniVote
                </PageHeaderDescription>

            </PageHeader>


            {loading ? <div className="flex md:px-10 gap-2  flex-col md:flex-row">
                <div className="md:w-[55rem] w-full">
                    <Skeleton className="w-full h-full md:h-[32rem]" />
                </div>
                <div className="w-full flex flex-col gap-4 md:pl-[12rem] ">
                    <Skeleton className="h-12 w-[20rem] rounded-lg" />
                    <Skeleton className="h-12  w-[20rem] rounded-lg" />
                    <Skeleton className="h-12  w-[20rem] rounded-lg" />
                    <Skeleton className="h-12  w-[20rem] rounded-lg" />
                    <Skeleton className="h-12  w-[20rem] rounded-lg" />
                    <Skeleton className="h-12  w-[20rem] rounded-lg" />
                    <Skeleton className="h-12  w-[20rem] rounded-lg" />
                </div>

            </div> :
                <div className="flex flex-col gap-[6rem]">
                    <div className="flex p-2 md:px-10 gap-2  flex-col md:flex-row">
                        <div className="md:w-[55rem] w-full">
                            <Image src={proposal?.image || imageUrl} alt="img" className="w-full" width={100} height={100} />
                        </div>

                        <div className="w-full flex flex-col gap-4 md:pl-[12rem] ">
                            <span className="flex flex-col gap-2 w-[20rem]">
                                <h2>Proposal Name </h2>
                                <Input value={proposal?.name} disabled />
                            </span>
                            <span className="flex flex-col gap-2 w-[20rem]">
                                <h2>Proposal Description </h2>
                                <Input value={proposal?.description} disabled />
                            </span>

                            <span className="flex flex-col gap-2 w-[20rem]">
                                <h2>Proposal Start Time  </h2>
                                <Input value={new Date(proposal?.startTime as number).toLocaleString()} disabled />
                            </span>

                            <span className="flex flex-col gap-2 w-[20rem]">
                                <h2>Proposal End Time  </h2>
                                <Input value={new Date(proposal?.endTime as number).toLocaleString()} disabled />
                            </span>
                            <span className="flex flex-col gap-2 w-[20rem]">
                                <h2>Proposal Main Chain</h2>
                                <Input value={getChainName(proposal?.mainChain as string)} disabled />
                            </span>
                            <span className="flex flex-col gap-2 w-[20rem]">
                                <h2>Proposal Supported Chains </h2>
                                <Input
                                    value={proposal?.supportedChains?.length
                                        ? proposal.supportedChains.map((chain: any) => getChainName(chain)).join(', ')
                                        : 'No chains chosen'}
                                    disabled />
                            </span>
                            <span className="flex flex-col gap-2 w-[20rem]">
                                <h2>Proposal smart contract ID </h2>
                                <Input value={proposal?.onChainID} disabled />
                            </span>
                            <span className="flex flex-col gap-2 w-[20rem]">
                                <h2>Proposal Total Votes </h2>
                                <Input value={proposal?.totalVotes} disabled />
                            </span>
                            <div className="flex flex-col gap-4 md:pt-2 ">
                                {proposal?.endTime as number > Date.now() ? <><Select onValueChange={(value) => handleChainSelect(value)} >
                                    <SelectTrigger className="md:w-[20rem]">
                                        <SelectValue placeholder="Supported chains to vote with" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {proposal?.supportedChains?.map((chain: any) => ({ value: chain, name: getChainName(chain) })).map((list: any, key: any) => <SelectItem value={list.value} key={key}>{list.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                    <div className="flex flex-col gap-4 md:w-[20rem]">
                                        <ProgressButton percentage={calculateVotePercentage("yes")} disabled={!chainToVote} onClick={() => handleVote("yes", 1)}>
                                            Yes {`${calculateVotePercentage("yes")}%`} {(proposal?.votes?.yes || 0) + " Votes"}{voteLoading === "yes" && <Loader size="sm" />}
                                        </ProgressButton>
                                        <ProgressButton percentage={calculateVotePercentage("no")} disabled={!chainToVote} onClick={() => handleVote("no", 2)}>
                                            No {`${calculateVotePercentage("no")}%`} {(proposal?.votes?.no || 0) + " Votes"}{voteLoading === "no" && <Loader size="sm" />}
                                        </ProgressButton>
                                        <ProgressButton percentage={calculateVotePercentage("abstain")} disabled={!chainToVote} onClick={() => handleVote("abstain", 3)}>
                                            Abstain {`${calculateVotePercentage("abstain")}%`} {(proposal?.votes?.abstain || 0) + " Votes"}{voteLoading === "abstain" && <Loader size="sm" />}
                                        </ProgressButton>
                                    </div>
                                </> :
                                    <span>  <Badge variant="destructive" className="">Proposal has expired</Badge></span>
                                }
                                <p className="text-red-500 text-xs">{getVoteFee(chainToVote as string)} {getChainTokenName(chainToVote as string) || "Eth"} fee to vote</p>
                                <a href={getContractUrl(proposal?.mainChain as string)} className="text-xs underline text-primary" target="_blank">View Smart Contract On Chain</a>
                            </div>
                        </div>
                    </div>
                    <div className="px-0 md:px-[2.8rem]">
                        <div className="flex flex-col gap-4 rounded-lg shadow-sm ring-1 ring-border">
                            <div className="flex-1 pl-4 text-lg font-medium pt-4">
                                <h2 className="capitalize">Vote history</h2>
                            </div>
                            <AttestationTable items={attestations as any} />
                        </div>

                    </div>
                </div>}

        </div>

    );
}

