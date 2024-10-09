import {
    PageHeader,
    PageHeaderDescription,
    PageHeaderHeading,
} from "@/components/page-header"
import { Button } from "@/components/ui/button";
import ApiWrapper from "@/lib/ApiWrapper";
import { useEffect, useState } from "react";
import { IProposal } from "@/model/proposal.model";
import { useRouter } from "next/router";
import { getChainConfig, getChainId, getChainName, getChainNameSignProtocol, getChainSelectorCrossChain, getRecieverAddressCrossChain } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Web3Adapter from "@/services/adapters/Web3Adapter";
import OmnivoteABI from "../../../data/abis/OmnivoteABI.json"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, useToast } from "@/components/ui/use-toast";
import { AttestationTable } from "@/components/attestation-table";
import { SignProtocolAdapter } from "@/services/adapters/SignProtocol";
import { IVote } from "@/model/vote.model";
import ethersRPC from "@/lib/ethersRPC";
import Loader from "@/components/loader";
import { Badge } from "@/components/ui/badge";
import ProgressButton from "@/components/progress-button";

const imageUrl = "https://ipfs.io/ipfs/QmUUshcrtd7Fj4nMmYB3oYRDXcswpB2gw7ECmokcRqcNMf";
export default function ProposalDetails() {
    const router = useRouter();
    const { proposalId } = router.query;
    const [loading, setLoading] = useState(false);
    const [voteLoading, setVoteLoading] = useState("");
    const { provider, switchChain, web3Auth, addChain, isConnected } = useWeb3Auth();
    const { toast } = useToast();
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

    const refreshAttestationList = async () => {
        if (proposalId) {
            await apiw.get(`vote?proposalId=${proposalId}`).then((data: any) => {
                const _votes = data.votes as IVote[];

                setAttestations(_votes as any);
            });
        }
    };


    useEffect(() => {

        refreshProposal();
        refreshAttestationList()

    }, [proposalId]);

    const handleChainSelect = (value: string) => {
        setChainToVote(value)
    }
    const handleVote = async (voteType: string) => {
        if (!isConnected) {
            toast({
                title: "Connect Wallet",
                description: "You need to connect your wallet to vote",
                duration: 2000,
            })
            return;
        }
        setVoteLoading(voteType)
        const address = await ethersRPC.getAccounts(provider as any);
        const connectedChainId = web3Auth?.options?.chainConfig?.chainId
        // const maxPriorityFeePerGas = "5000000000"; // Max priority fee per gas
        // const maxFeePerGas = "6000000000000"; // Max fee per gas
        try {

            if (connectedChainId != getChainId(chainToVote as string)) {
                await addChain(getChainConfig(chainToVote as string))
                await switchChain({ chainId: getChainId(chainToVote as string) })
            }
            if (getChainConfig(chainToVote as string) == getChainConfig(proposal?.mainChain as string)) {
                const web3Adapter = await Web3Adapter.create(provider, chainToVote as string, OmnivoteABI);
                await web3Adapter.sendTransaction("submitVote", "VoteSubmitted", proposal?.onChainID, 1);

            } else {
                const web3Adapter = await Web3Adapter.create(provider, chainToVote as string, OmnivoteABI);
                await web3Adapter.sendTransaction("submitVoteCrossChain", "MessageSent", getChainSelectorCrossChain(chainToVote as string), getRecieverAddressCrossChain(chainToVote as string), proposal?.onChainID as string,
                );

            }
            const signProtocol = new SignProtocolAdapter({ chain: getChainNameSignProtocol(chainToVote as string) })
            const signResponse = await signProtocol.createAttestation({ proposalId: proposal?.onChainID })
            await apiw.put(`proposal/${proposal?._id as string}`, {
                totalVotes: Number(proposal?.totalVotes) + 1,
                votes: { ...proposal?.votes, [voteType]: (proposal as any)[voteType] + 1 }
            })
            await apiw.post("/vote", {
                attestationId: signResponse.attestationId, proposalId, attester: address, proposalAddress: proposal?.onChainID
            })
            toast({
                title: "Successfully voted on this protocol"
            })
            refreshProposal();
            refreshAttestationList()
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
        const totalVotes = 10
        Number(proposal.totalVotes);

        const type =
            Number(proposal.votes?.[voteType]) || 0

        const percentage = 100 * Number(type / totalVotes) || 0
        return percentage
    }

    return (
        <div className="container relative  pb-[10rem]">
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
                    <div className="flex md:px-10 gap-2  flex-col md:flex-row">

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
                                {proposal?.endTime as number > Date.now() ? <><Select
                                    onValueChange={(value) => handleChainSelect(value)}
                                >
                                    <SelectTrigger className="md:w-[20rem]">
                                        <SelectValue placeholder="Supported chains to vote with" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {proposal?.supportedChains?.map((chain: any) => ({ value: chain, name: getChainName(chain) })).map((list: any, key: any) => <SelectItem value={list.value} key={key}>{list.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                    <div className="flex flex-col gap-4 md:w-[20rem]">
                                        <ProgressButton percentage={calculateVotePercentage("yes")} disabled={!chainToVote} onClick={() => handleVote("yes")}>
                                            Yes {`${calculateVotePercentage("yes")}%`} {proposal?.votes?.yes || 0 + " Votes"}{voteLoading === "yes" && <Loader size="sm" />}
                                        </ProgressButton>
                                        <ProgressButton percentage={calculateVotePercentage("no")} disabled={!chainToVote} onClick={() => handleVote("no")}>
                                            No {`${calculateVotePercentage("no")}%`} {proposal?.votes?.yes || 0 + " Votes"}{voteLoading === "no" && <Loader size="sm" />}
                                        </ProgressButton>
                                        <ProgressButton percentage={calculateVotePercentage("abstain")} disabled={!chainToVote} onClick={() => handleVote("abstain")}>
                                            Abstain {`${calculateVotePercentage("abstain")}%`} {proposal?.votes?.yes || 0 + " Votes"}{voteLoading === "abstain" && <Loader size="sm" />}
                                        </ProgressButton>
                                    </div>

                                </> :
                                    <Badge variant="destructive" className="">Proposal has expired</Badge>
                                }
                            </div>


                        </div>
                    </div>
                    <div className=" px-[2.8rem]">
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
