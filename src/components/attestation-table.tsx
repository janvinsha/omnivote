import * as React from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddressWithCopyButton from "./address-with-copy-button";

export function AttestationTable({ items }: { items: any[], }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Time of Vote</TableHead>
                    <TableHead>Proposal ID OnChain</TableHead>
                    <TableHead>Vote Type</TableHead>
                    <TableHead className="text-right">Voter</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items?.map((item, key) =>
                    <TableRow key={key}>
                        <TableCell>{item?.proposalAddress ? new Date(item.createdAt).toLocaleString() : new Date(Number(item.attestTimestamp)).toLocaleString()}</TableCell>
                        <TableCell>
                            <AddressWithCopyButton address={item?.proposalAddress || item?.voter} />
                        </TableCell>
                        <TableCell>{item?.voteType || "Yes"}</TableCell>
                        <TableCell className="text-right">
                            <AddressWithCopyButton address={item?.voter} />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
