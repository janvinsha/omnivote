import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
    description: z.string().max(160).min(4)
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
    // bio: "I own a computer.",
    // urls: [
    //     { value: "https://shadcn.com" },
    //     { value: "http://twitter.com/shadcn" },
    // ],
}

//TODO: end time should not be before start time
export function CreateDaoForm() {
    const apiw = ApiWrapper.create();
    const { initModal, isConnected, web3Auth, connect, logout, userInfo } = useWeb3Auth();
    console.log("THIS IS THE SIGNED IN USER INFO", EvmChains.sepolia)


    const hiddenBannerInput = React.useRef(null);
    const [banner, setBanner] = useState<any>();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange"
    })


    async function onSubmit(data: ProfileFormValues) {
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
        const response = await apiw.post('dao', {
            ...data, banner
        })

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
                                    <Input placeholder="shadcn" {...field}
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

                    <Button type="submit">Create DAO</Button>
                </form>
            </Form>
        </>
    )
}
