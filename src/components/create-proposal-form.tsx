
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Types } from "mongoose";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "@radix-ui/react-icons"
import { toast } from "@/components/ui/use-toast"
import React, { useEffect, useState } from "react"
import ApiWrapper from "@/lib/ApiWrapper"
import Web3Adapter from "@/services/adapters/Web3Adapter"
import OmnivoteABI from "../data/abis/OmnivoteABI.json"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import { DaoDocument, IDao } from "@/model/dao.model"
import Loader from "./loader";
import { uploadFileToIPFS } from "@/services/adapters/IPFSAdapter";
import ethersRPC from "@/lib/ethersRPC"
import { getChainConfig, getChainId } from "@/lib/utils";
import { SignProtocolAdapter } from "@/services/adapters/SignProtocol";
import { EvmChains } from "@ethsign/sp-sdk";

const proposalFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(30, {
            message: "Name must not be longer than 30 characters.",
        }),
    description: z
        .string()
        .min(4, {
            message: "Description must be at least 4 characters.",
        })
        .max(500, {
            message: "Description must not be longer than 160 characters.",
        }),
    startTime: z.date({
        required_error: "Start time is required.",
    }),
    endTime: z.date({
        required_error: "End time is required.",
    }).refine((endTime: any, ctx: any) => {
        const startTime = ctx?.parent?.startTime; // Access the sibling `startTime` directly
        if (startTime && endTime <= startTime) {
            return false;
        }
        return true;
    }, {
        message: "End time must be after the start time.",
    }),
    dao: z
        .string(),
    quorum: z
        .string()
});

export default proposalFormSchema;



type ProfileFormValues = z.infer<typeof proposalFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {

}

export function CreateProposalForm({ closeDialog, refreshList }: { closeDialog: any, refreshList: any }) {
    const apiw = ApiWrapper.create();
    const { provider, userInfo, authenticateUser, status, web3Auth, switchChain, addChain } = useWeb3Auth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [banner, setBanner] = useState<any>();
    const [daos, setDaos] = useState<IDao[]>()
    const [selectedDao, setSelectedDao] = useState<IDao | null>(null);  // Add selectedDao state
    const connectedChainId = web3Auth?.options?.chainConfig?.chainId
    const refreshDaoList = async () => {
        try {
            // Get the address from ethersRPC
            const address = await ethersRPC.getAccounts(provider);
            console.log("THESE ARE THE OPTIONS", address);

            // Fetch the list of DAOs
            const response = await apiw.get('dao');
            const daos = response.daos as IDao[];

            // Filter the DAOs to only include those that match the address
            const filteredDaos = daos.filter((dao: IDao) => dao.ownerAddress == address);

            // Set the filtered list of DAOs
            setDaos(filteredDaos);
        } catch (error) {
            console.error("Error refreshing DAO list:", error);
        }
    };

    useEffect(() => {
        refreshDaoList();
    }, []);

    const handleDaoSelect = (onChainID: string) => {
        const selected = daos?.find(dao => dao.onChainID === onChainID) || null;
        setSelectedDao(selected);  // Update the selected DAO
    };


    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(proposalFormSchema),
        defaultValues,
        mode: "onChange"
    })


    async function onSubmit(data: ProfileFormValues) {

        // const { maxPriorityFeePerGas, maxFeePerGas } = await ethersRPC.getFees(provider)

        setIsSubmitting(true);
        try {
            if (!banner) {
                toast({
                    title: "Please upload a banner",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                        </pre>
                    ),
                })
                return;
            }
            let _banner = await uploadFileToIPFS(banner);
            const startTime = data.startTime.getTime();
            const endTime = data.endTime.getTime()
            console.log("THIS IS THE CHAIN", selectedDao)

            if (connectedChainId != getChainId(selectedDao?.mainChain as string)) {
                await addChain(getChainConfig(selectedDao?.mainChain as string))
                await switchChain({ chainId: getChainId(selectedDao?.mainChain as string) })
            }

            const web3Adapter = await Web3Adapter.create(provider, selectedDao?.mainChain as string, OmnivoteABI);
            //Convert unix timestamp which is in milliseconds to block timestamp which is in seconds or it will not work
            const transactionResponse = await web3Adapter.sendTransaction("createProposal", "ProposalCreated", data.dao, data.description, startTime / 1000, endTime / 1000, Number(data.quorum)
                // ,
                // {
                //     maxPriorityFeePerGas,
                //     maxFeePerGas
                // }
            );

            await apiw.post('proposal', {
                ...data, startTime, endTime,
                onChainID:
                    transactionResponse[0],
                image: _banner,
                ownerAddress: selectedDao?.ownerAddress,
                mainChain: selectedDao?.mainChain, supportedChains: selectedDao.supportedChains
            })
            closeDialog()
            refreshList()
            toast({
                title: "Successfully added a new proposal"
            })
        } catch (error) {
            console.log("Error here", error)
            toast({
                title: "Error adding a new proposal",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false); // Stop loading
        }

    }

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setBanner(Object.assign(file, {
                preview: URL.createObjectURL(file),
            }));
            // form.setValue("banner", file, { shouldValidate: true });
        } else {
            // form.setError("banner", { type: "manual", message: "Invalid file type. Please upload an image." });
        }
    };

    return (
        <>
            {/* <Button onClick={onTestCreateSchema}>Test</Button> */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <FormField
                        control={form.control}
                        name="dao"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dao</FormLabel>
                                <Select onValueChange={(value) => {
                                    field.onChange(value);  // Set form value
                                    handleDaoSelect(value); // Update selected DAO
                                }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {daos?.map((dao, key) => <SelectItem value={dao.onChainID} key={key}>{dao.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Choose Dao for proposal
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is name of the proposal
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quorum"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quorum</FormLabel>
                                <FormControl>
                                    <Input placeholder="quorum" {...field}
                                        type="number"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Choose the amount of votes needed for proposal to be valid
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex flex-col gap-2">
                        <FormLabel>Banner</FormLabel>
                        {banner?.preview ?
                            <>
                                <img
                                    src={banner.preview}
                                    alt="banner preview" width={100} height={100} />
                            </> : ""
                        }

                        <Input placeholder="shadcn"
                            type="file"
                            onChange={(e) => {
                                handleBannerChange(e);
                                // form.register('banner').onChange(e);
                            }}
                        />
                        <FormDescription>
                            This is the banner of the Dao
                        </FormDescription>
                    </div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Description" {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is the description of the proposal
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Start time</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(date) => {
                                                const twoDaysBefore = new Date();
                                                twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);  // Subtract 2 days
                                                twoDaysBefore.setHours(0, 0, 0, 0);  // Set the time to the start of the day

                                                if (date && date >= twoDaysBefore) {
                                                    field.onChange(date);  // Allow dates two days before and future dates
                                                }
                                            }}
                                            disabled={(date) => {
                                                const twoDaysBefore = new Date();
                                                twoDaysBefore.setDate(twoDaysBefore.getDate() - 2); // Subtract 2 days
                                                twoDaysBefore.setHours(0, 0, 0, 0); // Set the time to the start of the day

                                                return date < twoDaysBefore; // Disable dates earlier than two days before today
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    Start time of the proposal.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>End time</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < form.getValues("startTime") // Disable dates before selected startTime
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    End time of the proposal.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />



                    <Button type="submit" >Create Proposal {isSubmitting && <Loader size="sm" />}</Button>
                </form>
            </Form>
        </>
    )
}


async function onTestCreateAttestation() {
    try {
        const signProtocol = new SignProtocolAdapter({ chain: EvmChains.sepolia })
        const response = await signProtocol.createAttestation({ proposalId: "12345" })
        console.log("THIS IS THE RESPONSE", response)
    } catch (error) {
        console.log("THIS IS THE ERROR", error)
    }
}

async function onTestCreateSchema() {
    try {
        const signProtocol = new SignProtocolAdapter({ chain: EvmChains.baseSepolia })
        const response = await signProtocol.createSchema({
            name: 'proposalId', type: 'string',
        })
        console.log("THIS IS THE RESPONSE", response)
    } catch (error) {
        console.log("THIS IS THE ERROR", error)
    }
}
