
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import React, { useState } from "react"

const profileFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Username must be at least 2 characters.",
        })
        .max(30, {
            message: "Username must not be longer than 30 characters.",
        }),
    omnichain: z
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

export function CreateForm() {

    const hiddenBannerInput = React.useRef(null);
    const [banner, setBanner] = useState<any>();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange"
    })


    function onSubmit(data: ProfileFormValues) {
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
    }

    // const handleBannerChange = async (e: any) => {
    //     const file = e.target.files[0];
    //     console.log('This is the file', file);
    //     if (file.type.startsWith('image')) {
    //         setBanner(
    //             Object.assign(file, {
    //                 preview: URL.createObjectURL(file),
    //             })
    //         );
    //     }
    // };

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
                                This is your public display name. It can be your real name or a
                                pseudonym. You can only change this once every 30 days.
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
                                This is your public display name. It can be your real name or a
                                pseudonym. You can only change this once every 30 days.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <>
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
                </>


                <FormField
                    control={form.control}
                    name="omnichain"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Choose Omnichain provider</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select omnichain provider" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="chainlink">Chainlink</SelectItem>
                                    <SelectItem value="layerzero">Layer Zero</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can manage verified email addresses in your{" "}
                                <Link href="/examples/forms">email settings</Link>.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit">Create DAO</Button>
            </form>
        </Form>
    )
}
