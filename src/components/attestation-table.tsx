import * as React from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AttestationTable({ items }: { items: any[], }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Time of Vote</TableHead>
                    <TableHead>Proposal ID OnChain</TableHead>
                    <TableHead>IPFS Hash</TableHead>
                    <TableHead className="text-right">Attester</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items?.map((item, key) =>
                    <TableRow key={key}>
                        <TableCell>{item?.proposalAddress ? new Date(item.createdAt).toLocaleString() : new Date(Number(item.attestTimestamp)).toLocaleString()}</TableCell>
                        <TableCell>{item?.proposalAddress || item?.voter}</TableCell>
                        <TableCell><a href={item?.ipfsHash} className="underline cursor-pointer hover:text-foreground/80">{item?.ipfsHash?.slice(0, 20)}...</a></TableCell>
                        <TableCell className="text-right">{item?.voter}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
