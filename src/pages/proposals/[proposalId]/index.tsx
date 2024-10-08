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
import { toast } from "@/components/ui/use-toast";
import { AttestationTable } from "@/components/attestation-table";
import { SignProtocolAdapter } from "@/services/adapters/SignProtocol";
import { IVote } from "@/model/vote.model";
import ethersRPC from "@/lib/ethersRPC";
import Loader from "@/components/loader";
import { useAccount } from 'wagmi'
import { uploadFileToIPFS } from "@/services/adapters/IPFSAdapter";
import { switchChain, writeContract, watchContractEvent } from '@wagmi/core'
import { config } from "@/config/wagmiConfig";

const imageUrl = "https://ipfs.io/ipfs/QmUUshcrtd7Fj4nMmYB3oYRDXcswpB2gw7ECmokcRqcNMf";
export default function ProposalDetails() {
    const router = useRouter();
    const { proposalId } = router.query;
    const [loading, setLoading] = useState(false);
    const [voteLoading, setVoteLoading] = useState(false);

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
    const handleVote = async () => {
        setVoteLoading(true)
        try {

            if (connectedChainId != getChainId(chainToVote as string)) {
                await switchChain(config, { chainId: getChainId(chainToVote as string) })
            }
            if (getChainConfig(chainToVote as string) == getChainConfig(proposal?.mainChain as string)) {

                await writeContract(config, {
                    abi: OmnivoteABI,
                    address: proposal?.mainChain as any,
                    functionName: 'submitVote',
                    args: [
                        proposal?.onChainID, 1
                    ],
                })

            } else {

                await writeContract(config, {
                    abi: OmnivoteABI,
                    address: chainToVote as any,
                    functionName: 'submitVoteCrossChain',
                    args: [
                        getChainSelectorCrossChain(chainToVote as string), getRecieverAddressCrossChain(chainToVote as string), proposal?.onChainID as string,
                    ],
                })
            }
            await apiw.put(`proposal/${proposal?._id as string}`, {
                totalVotes: Number(proposal?.totalVotes) + 1
            })
            const ipfsHash = await uploadFileToIPFS(JSON.stringify({ proposalId, voter: address, proposalAddress: proposal?.onChainID }));
            await apiw.post("/vote", {
                ipfsHash: ipfsHash, proposalId, voter: address, proposalAddress: proposal?.onChainID
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
            setVoteLoading(false)
        }
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


                            <span className="flex gap-2 md:pt-6 ">
                                {proposal?.endTime as number > Date.now() ? <><Select
                                    onValueChange={(value) => handleChainSelect(value)}
                                >
                                    <SelectTrigger className="md:w-[15rem]">
                                        <SelectValue placeholder="Supported chains to vote with" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {proposal?.supportedChains?.map((chain: any) => ({ value: chain, name: getChainName(chain) })).map((list: any, key: any) => <SelectItem value={list.value} key={key}>{list.name}</SelectItem>)}
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
                            <AttestationTable items={attestations as any} />
                        </div>

                    </div>
                </div>}

        </div>

    );
}
