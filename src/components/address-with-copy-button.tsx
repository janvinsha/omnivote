// components/AddressWithCopyButton.tsx
import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import clsx from "clsx";

const AddressWithCopyButton = ({ address, className }: { address: string, className?: string }) => {
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleCopy = () => {
        navigator.clipboard.writeText(address).then(() => {
            setCopied(true);
            toast({
                title: "Copied!",
                description: "The address has been copied to your clipboard.",
                duration: 2000,
            });
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className={clsx("flex items-center w-full", className)}
        >
            <span className="text-gray-700 text-xs">{address}</span>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="px-2 outline-none">
                {copied ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
            </Button>
        </div>
    );
};

export default AddressWithCopyButton;
