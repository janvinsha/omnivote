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
import { CreateProposalDialog } from "@/components/create-proposal-dialog";
import { IProposal } from "@/model/proposal.model";
import { useRouter } from "next/router";
import { getChainConfig, getChainId, getChainName, getChainNameSignProtocol, getChainSelectorCrossChain, getRecieverAddressCrossChain } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { baseContractAddress, sepoliaContractAddress } from "@/data/contracts";

import Web3Adapter from "@/services/adapters/Web3Adapter";
import OmnivoteABI from "../../../data/abis/OmnivoteABI.json"
import { ethers } from "ethers";
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import Image from "next/image";
import { baseSepoliaChainConfig } from "@/lib/web3AuthProviderProps";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { AttestationTable } from "@/components/attestation-table";
import { SignProtocolAdapter } from "@/services/adapters/SignProtocol";
import { EvmChains } from "@ethsign/sp-sdk";
import { IVote } from "@/model/vote.model";
import ethersRPC from "@/lib/ethersRPC";
import Loader from "@/components/loader";

const list = { name: "Attestations", items: [{ name: "Propsal 1" }, { name: "Proposal 2" }, { name: "Propsal 1" }, { name: "Proposal 2" }, { name: "Propsal 1" }, { name: "Proposal 2" }] }

const imageUrl = "https://ipfs.io/ipfs/QmUUshcrtd7Fj4nMmYB3oYRDXcswpB2gw7ECmokcRqcNMf";
export default function ProposalDetails() {
    const router = useRouter();
    const { pathname } = router;
    const { proposalId } = router.query;
    const [loading, setLoading] = useState(false);
    const [voteLoading, setVoteLoading] = useState(false);
    const { provider, switchChain, status, userInfo, web3Auth, addChain, account } = useWeb3Auth();

    const [attestations, setAttestations] = useState()


    const [proposal, setProposal] = useState<IProposal>()
    const [chainToVote, setChainToVote] = useState<string>()

    const omnivoteContractList = [{
        value: sepoliaContractAddress, name: "ETH Sepolia"
    }, {
        value: baseContractAddress, name: "Base Sepolia"
    }]


    console.log("THIS IS THE PROPOSAL ID", proposal)
    const apiw = ApiWrapper.create();
    const refreshProposal = async () => {
        setLoading(true)
        try {
            if (proposalId) {
                await apiw.get(`proposal/${proposalId}`).then((data: any) => {
                    const _proposal = data.proposal as IProposal;
                    console.log("THIS IS THE PROPOSAL", _proposal)
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
                console.log("THIS IS THE PROPOSAL", _votes)
                setAttestations(_votes);
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
    const handleVote = async () => {
        setVoteLoading(true)
        const address = await ethersRPC.getAccounts(provider);
        const connectedChainId = web3Auth?.options?.chainConfig?.chainId
        // const maxPriorityFeePerGas = "5000000000"; // Max priority fee per gas
        // const maxFeePerGas = "6000000000000"; // Max fee per gas
        try {
            console.log("THIS IS THE CONNECTED CHAIN ID 1", connectedChainId)
            if (connectedChainId != getChainId(chainToVote as string)) {
                await addChain(getChainConfig(chainToVote as string))
                await switchChain({ chainId: getChainId(chainToVote as string) })
            }
            if (getChainConfig(chainToVote as string) == getChainConfig(proposal?.mainChain as string)) {
                console.log("THE SUBMIT VOTE METHOD IS BEING CALLED")
                const web3Adapter = await Web3Adapter.create(provider, chainToVote as string, OmnivoteABI);
                await web3Adapter.sendTransaction("submitVote", "VoteSubmitted", proposal?.onChainID, 1);

            } else {
                console.log("THE SUBMIT VOTE METHOD CROSS CHAIN IS BEING CALLED")
                const web3Adapter = await Web3Adapter.create(provider, chainToVote as string, OmnivoteABI);
                await web3Adapter.sendTransaction("submitVoteCrossChain", "MessageSent", getChainSelectorCrossChain(chainToVote as string), getRecieverAddressCrossChain(chainToVote as string), proposal?.onChainID as string,
                    // {
                    //     maxPriorityFeePerGas,
                    //     maxFeePerGas
                    // }
                );

            }
            const signProtocol = new SignProtocolAdapter({ chain: getChainNameSignProtocol(chainToVote as string) })
            const signResponse = await signProtocol.createAttestation({ proposalId: proposal?.onChainID })
            console.log("THIS IS THR SIGN RESPONSE", signResponse)
            await apiw.put(`proposal/${proposal?._id}`, {
                totalVotes: Number(proposal?.totalVotes) + 1
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
            setVoteLoading(false)
        }
    }


    // const endVoting = async () => {
    //     const address = await ethersRPC.getAccounts(provider);
    //     const connectedChainId = web3Auth?.options?.chainConfig?.chainId
    //     const maxPriorityFeePerGas = "5000000000"; // Max priority fee per gas
    //     const maxFeePerGas = "6000000000000"; // Max fee per gas
    //     try {
    //         if (connectedChainId != getChainId(proposal?.mainChain as string)) {
    //             await addChain(getChainConfig(proposal?.mainChain as string))
    //             await switchChain({ chainId: getChainId(proposal?.mainChain as string) })
    //         }

    //         const web3Adapter = await Web3Adapter.create(provider, chainToVote as string, OmnivoteABI);
    //         const transactionResponse = await web3Adapter.sendTransaction("finalizeProposal", "ProposalFinalized", proposal?.onChainID);

    //         await apiw.put("/proposal", {
    //             hasEnded: true
    //         })
    //         toast({
    //             title: "Successfully ended proposal"
    //         })
    //     }
    //     catch (error) {
    //         console.log("THIS IS THE ERROR", error)
    //         toast({
    //             title: "Error voting",
    //             variant: "destructive"
    //         })
    //     }
    // }


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
                                        ? proposal.supportedChains.map(chain => getChainName(chain)).join(', ')
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


                            <span className="flex gap-2 md:pt-6 ">
                                {proposal?.endTime > Date.now() ? <><Select
                                    onValueChange={(value) => handleChainSelect(value)}
                                >
                                    <SelectTrigger className="md:w-[15rem]">
                                        <SelectValue placeholder="Supported chains to vote with" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {proposal.supportedChains?.map(chain => ({ value: chain, name: getChainName(chain) })).map((list, key) => <SelectItem value={list.value} key={key}>{list.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>

                                    <Button disabled={!chainToVote} onClick={handleVote}>Vote on this proposal {voteLoading && <Loader size="sm" />}</Button>
                                </> :
                                    ""
                                }
                            </span>


                        </div>
                    </div>
                    <div className=" px-[2.8rem]">
                        <div className="flex flex-col gap-4 rounded-lg shadow-sm ring-1 ring-border">
                            <div className="flex-1 pl-4 text-lg font-medium pt-4">
                                <h2 className="capitalize">Vote history</h2>
                            </div>
                            <AttestationTable items={attestations} />
                        </div>

                    </div>
                </div>}

        </div>

    );
}
