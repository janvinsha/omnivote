
import Link from "next/link"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateProposalForm } from "./create-proposal-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function CreateProposalDialog() {
    const [isOpen, setIsOpen] = useState(false);  // State to control dialog visibility

    const closeDialog = () => {
        setIsOpen(false);  // Function to close dialog
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger asChild>
                <Button className="">Create Proposal</Button>
            </DialogTrigger>
            <DialogContent className="h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Create Proposal</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-scroll h-5/6">
                    <CreateProposalForm closeDialog={closeDialog} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
