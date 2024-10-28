
import Link from "next/link"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { useConnect } from 'wagmi'

export function ConnectWalletDialog() {
    const [isOpen, setIsOpen] = useState(false);  // State to control dialog visibility

    const closeDialog = () => {
        setIsOpen(false);  // Function to close dialog
    };

    const handleConnect = async (connector: any) => {
        await connect({ connector })
        closeDialog()
    }
    const { connectors, connect } = useConnect()
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" >Connect Wallet</Button>
            </DialogTrigger>
            <DialogContent className="h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Connect Wallet</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-scroll h-5/6">
                    <div className="grid grid-cols-3 gap-4">
                        {connectors.map((connector) => (
                            <Button className="h-32" size="sm" variant="outline" key={connector.uid} onClick={() => handleConnect(connector)}>
                                <div className="flex flex-col gap-2 items-center">
                                    {connector.icon && <img src={connector.icon} className="w-[4rem]" alt="Connector Icon" />}
                                    <span>{connector.name}</span>
                                </div>

                            </Button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
