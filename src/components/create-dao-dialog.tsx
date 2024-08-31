
import Link from "next/link"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreateDaoForm } from "./create-dao-form";
import { Button } from "@/components/ui/button";

export function CreateDaoDialog() {
    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button className="">Create DAO</Button>
            </DialogTrigger>
            <DialogContent className="h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Create Dao</DialogTitle>

                </DialogHeader>
                <div className="overflow-y-scroll h-5/6">
                    <CreateDaoForm />
                </div>
            </DialogContent>
        </Dialog>
    )
}
