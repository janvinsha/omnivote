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
import React, { useState } from "react"
import ApiWrapper from "@/lib/ApiWrapper"
import { SignProtocolAdapter } from "@/services/adapters/SignProtocol"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"
import {
    EvmChains,
} from '@ethsign/sp-sdk';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { sepoliaContractAddress, baseContractAddress } from "../data/contracts"
import OmnivoteABI from "../data/abis/OmnivoteABI.json"
import Web3Adapter from "@/services/adapters/Web3Adapter";
import { Checkbox } from "./ui/checkbox";
import { uploadFileToIPFS } from "@/services/adapters/IPFSAdapter";
import Loader from "./loader";

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
    description: z.string().max(160).min(4)
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
    supportedChains: [`${sepoliaContractAddress}`],
}



export function CreateDaoForm({ closeDialog }: { closeDialog: any }) {
    const apiw = ApiWrapper.create();
    const { userInfo, provider } = useWeb3Auth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    console.log("THE USER INFO", userInfo)
    const omnivoteContractList = [{
        value: sepoliaContractAddress, name: "ETH Sepolia"
    }, {
        value: baseContractAddress, name: "Base Sepolia"
    }]


    const hiddenBannerInput = React.useRef(null);
    const [banner, setBanner] = useState<any>();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange"
    })


    async function onSubmit(data: ProfileFormValues) {
        setIsSubmitting(true);
        try {
            const web3Adapter = await Web3Adapter.create(provider, data.mainChain, OmnivoteABI);
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
            console.log("THIS IS THE BANNER", _banner)

            const transactionResponse = await web3Adapter.sendTransaction("addDao", "DaoAdded", data.name, data.description);
            console.log("THIS SI THE TRANSACTION RESPONSE", transactionResponse[0])
            await apiw.post('dao', {
                ...data, banner: _banner, onChainID: transactionResponse[0], address: transactionResponse[1]
            })
            closeDialog()
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
                                    <Input placeholder="shadcn" {...field}
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
                        name="mainChain"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Main Chain</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                    <Button type="submit">Create DAO {isSubmitting && <Loader size="sm" />}</Button>
                </form>
            </Form>
        </>
    )
}




async function onTestCreateSchema() {
    try {
        const signProtocol = new SignProtocolAdapter({ chain: EvmChains.polygonAmoy })
        const response = await signProtocol.createSchema({
            name: 'proposalId', type: 'string',
        })
        console.log("THIS IS THE RESPONSE", response)
    } catch (error) {
        console.log("THIS IS THE ERROR", error)
    }
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
