import * as React from "react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AttestationTable({ items }: { items: any[], }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Time of Vote</TableHead>
                    <TableHead>Proposal ID OnChain</TableHead>
                    <TableHead>Attestation ID</TableHead>
                    <TableHead className="text-right">Attester</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items?.map((item, key) =>
                    <TableRow key={key}>
                        <TableCell>{item?.proposalAddress ? new Date(item.createdAt).toLocaleString() : new Date(Number(item.attestTimestamp)).toLocaleString()}</TableCell>
                        <TableCell>{item?.proposalAddress || item?.attester}</TableCell>
                        <TableCell>{item?.attestationId}</TableCell>
                        <TableCell className="text-right">{item?.attester}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}
