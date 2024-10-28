import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { create } from "ipfs-http-client";

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
import { toast } from "@/components/ui/use-toast"
import React, { useEffect, useState } from "react"
import ApiWrapper from "@/lib/ApiWrapper"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { amoyContractAddress, polygonContractAddress, } from "../data/contracts"
import OmnivoteABI from "../data/abis/OmnivoteABI.json"
import { Checkbox } from "./ui/checkbox";
import { uploadFileToIPFS } from "@/services/adapters/IPFSAdapter";
import Loader from "./loader";
import { getChainId, getChainTokenName, getCreationFee, omnivoteContractList } from "@/lib/utils";
import { useAccount } from 'wagmi'
import { switchChain, writeContract, watchContractEvent, getGasPrice } from '@wagmi/core'
import { config } from "@/config/wagmiConfig";
import { ethers } from "ethers";

const appEnv = process.env.NEXT_PUBLIC_APP_ENV || "testnet"

const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
    mainChain: z.string(),
    supportedChains: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one chain",
    }),
    description: z.string().max(500).min(4)
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.

const defaultValues: Partial<ProfileFormValues> = {
    supportedChains: [`${appEnv === "testnet" ? amoyContractAddress : polygonContractAddress}`],
}



export function CreateDaoForm({ closeDialog, refreshList }: { closeDialog: any, refreshList: any }) {
    const apiw = ApiWrapper.create();
    const { address, chainId: connectedChainId } = useAccount()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mainChain, setMainChain] = useState("")


    const [banner, setBanner] = useState<any>();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
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

            const chainIdMainChain = getChainId(data.mainChain as string);
            console.log("THIS IS THE CHAIN", chainIdMainChain)
            if (connectedChainId != chainIdMainChain) {
                await switchChain(config, { chainId: chainIdMainChain })
            }

            const realChainAddress = data?.mainChain?.split("-")[0]

            console.log("THIS IS THE DATA", { ...data, _banner })
            await writeContract(config, {
                abi: OmnivoteABI,
                address: realChainAddress as any,
                chainId: getChainId(data?.mainChain),
                functionName: 'addDao',
                args: [
                    data.name, data.description
                ],
                value: ethers.parseEther(getCreationFee(mainChain)),

            })

            const resultWatch: any = await new Promise((resolve, reject) => {
                try {
                    watchContractEvent(
                        config,
                        {
                            abi: OmnivoteABI,
                            address: realChainAddress as any,
                            eventName: 'DaoAdded',
                            onLogs(logs) {
                                console.log('New logs!', logs);
                                resolve(logs); // Resolves the promise when the logs are received
                            },
                            poll: true
                            //Uncaught (in promise) Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received
                        }
                    )
                } catch (error) {
                    reject(error)
                }
            });

            console.log("RESULT FROM ADDING DAO", resultWatch)
            await apiw.post('dao', {
                ...data, image: _banner, onChainID: resultWatch[0]?.topics?.[1] as string, ownerAddress: address
            })
            closeDialog()
            refreshList()
            toast({
                title: "Successfully added a new dao",
            })
        } catch (error) {
            console.log("Error here", error)
            toast({
                title: "Error adding a new dao",
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
            {/* <Button onClick={onTestCreateAttestation}>Test</Button> */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="DAO name" {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is the name of the Dao
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="DAO description" {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    This is the description of the Dao
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

                        <Input placeholder="DAO banner"
                            type="file"
                            onChange={(e) => {
                                handleBannerChange(e);
                            }}
                        />
                        <FormDescription>
                            This is the banner of the Dao
                        </FormDescription>
                    </div>

                    <FormField
                        control={form.control}
                        name="mainChain"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Main Chain</FormLabel>
                                <Select onValueChange={(value) => {
                                    field.onChange(value)
                                    setMainChain(value)
                                }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {omnivoteContractList.map((list, key) => <SelectItem value={list.value} key={key}>{list.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Choose the chain for this DAO

                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="supportedChains"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Supported Chains</FormLabel>
                                    <FormDescription>
                                        These are the chains that can interact with your proposals
                                    </FormDescription>
                                </div>
                                {omnivoteContractList.map((chain) => (
                                    <FormField
                                        key={chain.value}
                                        control={form.control}
                                        name="supportedChains"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={chain.value}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(chain.value)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field?.value, chain.value])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== chain.value
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {chain.name}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <p className="text-red-500 text-xs">{getCreationFee(mainChain as string)} {getChainTokenName(mainChain as string) || "Bnb"} fee to create Dao</p>
                    <Button type="submit">Create DAO {isSubmitting && <Loader size="sm" />}</Button>
                </form>
            </Form>
        </>
    )
}




