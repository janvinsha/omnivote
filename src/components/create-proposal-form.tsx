
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Types } from "mongoose";
import { cn, getChainTokenName, getCreationFee } from "@/lib/utils"
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
import OmnivoteABI from "../data/abis/OmnivoteABI.json"
import { IDao } from "@/model/dao.model"
import Loader from "./loader";
import { uploadFileToIPFS } from "@/services/adapters/IPFSAdapter";
import { getChainId } from "@/lib/utils";
import { useAccount } from 'wagmi'
import { switchChain, writeContract, watchContractEvent,waitForTransactionReceipt } from '@wagmi/core'
import { config } from "@/config/wagmiConfig";
import { ethers } from "ethers";
//TODO: add a better date and time pitcker

const proposalFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        })
        .max(100, {
            message: "Name must not be longer than 100 characters.",
        }),
    description: z
        .string()
        .min(4, {
            message: "Description must be at least 4 characters.",
        })
        .max(500, {
            message: "Description must not be longer than 500 characters.",
        }),
    startTime: z.date({
        required_error: "Start time is required.",
    }),
    endTime: z.date({
        required_error: "End time is required.",
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
    const { address, chainId: connectedChainId } = useAccount()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [banner, setBanner] = useState<any>();
    const [daos, setDaos] = useState<any[]>()
    const [selectedDao, setSelectedDao] = useState<any | null>(null);  // Add selectedDao state
    const [selectedStartTime, setSelectedStartTime] = useState("00:00");
    const [selectedEndTime, setSelectedEndTime] = useState("00:00");
    const refreshDaoList = async () => {
        try {
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

    const handleDaoSelect = (id: string) => {
        const selected = daos?.find(dao => dao?._id === id) || null;
        setSelectedDao(selected);  // Update the selected DAO
    };


    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(proposalFormSchema),
        defaultValues,
        mode: "onChange"
    })


    async function onSubmit(data: ProfileFormValues) {

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
            const chainIdMainChain = getChainId(selectedDao?.mainChain as string);

            if (connectedChainId != chainIdMainChain) {
                await switchChain(config, { chainId: chainIdMainChain })
            }

            await writeContract(config, {
                abi: OmnivoteABI,
                address: selectedDao?.mainChain as any,
                functionName: 'createProposal',

                args: [
                    selectedDao.onChainID, data.description, startTime / 1000, endTime / 1000, Number(data.quorum)
                ],
                value: ethers.parseEther(getCreationFee(selectedDao?.mainChain))
            })

            const resultWatch: any = await new Promise((resolve, reject) => {
                try {
                    watchContractEvent(
                        config,
                        {
                            abi: OmnivoteABI,
                            address: selectedDao?.mainChain as any,
                            eventName: 'ProposalCreated',
                            onLogs(logs: any) {
                                console.log('New logs!', logs);
                                resolve(logs); // Resolves the promise when the logs are received
                            },
                            poll: true
                        }
                    )
                } catch (error) {
                    reject(error)
                }
            });


            await apiw.post('proposal', {
                ...data, startTime, endTime,
                onChainID:
                    resultWatch[0]?.topics?.[1] as string,
                image: _banner,
                ownerAddress: selectedDao?.ownerAddress,
                daoId: selectedDao?._id as string,
                mainChain: selectedDao?.mainChain, supportedChains: selectedDao?.supportedChains
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
                                    console.log("WHAT THE FUCK IS HAPPENING HERE", value)
                                    field.onChange(value);  // Set form value
                                    handleDaoSelect(value); // Update selected DAO
                                }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {daos?.map((dao, key) => <SelectItem value={dao?._id as string} key={dao?._id as string}>{dao.name}</SelectItem>)}
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
                                                    !field?.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field?.value ? (
                                                    format(field?.value, "PPP")
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
                                        <div className="px-4 p-2">
                                            <input aria-label="Time"
                                                name="endTime" type="time"
                                                value={selectedStartTime}
                                                onChange={(e) => {
                                                    e.preventDefault()
                                                    setSelectedStartTime(e.target.value);
                                                    console.log("THIS SI THE E", e.target.value)
                                                    if (e.target.value && field.value) {
                                                        // Combine the selected time with the existing date
                                                        const [hours, minutes] = e.target.value.split(":").map(Number);
                                                        const updatedDate = new Date(field.value);
                                                        updatedDate.setHours(hours, minutes);

                                                        console.log("THIS SI THE UPFATED DATE", updatedDate)
                                                        // Update the field with the new date and time
                                                        field.onChange(updatedDate);
                                                    }
                                                }
                                                }

                                                disabled={!field?.value} />
                                        </div>
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
                                                    !field?.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field?.value ? (
                                                    format(field?.value, "PPP")
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
                                        <div className="px-4 p-2">
                                            <input aria-label="Time"
                                                name="endTime" type="time"
                                                value={selectedEndTime}
                                                onChange={(e) => {
                                                    e.preventDefault()
                                                    setSelectedEndTime(e.target.value);
                                                    if (e.target.value && field.value) {
                                                        // Combine the selected time with the existing date
                                                        const [hours, minutes] = e.target.value.split(":").map(Number);
                                                        const updatedDate = new Date(field.value);
                                                        updatedDate.setHours(hours, minutes);

                                                        // Update the field with the new date and time
                                                        field.onChange(updatedDate);
                                                    }
                                                }

                                                }
                                                disabled={!field?.value} />
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormDescription>
                                    End time of the proposal.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <p className="text-red-500 text-xs">{getCreationFee(selectedDao?.mainChain as string)} {getChainTokenName(selectedDao?.mainChain as string) || "Eth"} fee to create proposal</p>

                    <Button type="submit" >Create Proposal {isSubmitting && <Loader size="sm" />}</Button>

                </form>
            </Form>
        </>
    )
}


// async function onTestCreateAttestation() {
//     try {
//         const signProtocol = new SignProtocolAdapter({ chain: EvmChains.sepolia })
//         const response = await signProtocol.createAttestation({ proposalId: "12345" })
//     } catch (error) {
//         console.log("THIS IS THE ERROR", error)
//     }
// }

// async function onTestCreateSchema() {
//     try {
//         const signProtocol = new SignProtocolAdapter({ chain: EvmChains.baseSepolia })
//         const response = await signProtocol.createSchema({
//             name: 'proposalId', type: 'string',
//         })
//         console.log("THIS IS THE RESPONSE", response)
//     } catch (error) {
//         console.log("THIS IS THE ERROR", error)
//     }
// }
