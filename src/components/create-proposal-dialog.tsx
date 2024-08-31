
import Link from "next/link"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateProposalForm } from "./create-proposal-form";
import { Button } from "@/components/ui/button";

export function CreateProposalDialog() {
    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button className="">Create Proposal</Button>
            </DialogTrigger>
            <DialogContent className="h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Create Proposal</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-scroll h-5/6">
                    <CreateProposalForm />
                </div>
            </DialogContent>
        </Dialog>
    )
}
