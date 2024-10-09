import { NextApiRequest, NextApiResponse } from "next";
import connectDb from '../../../../model/db';
import ProposalModel, { ProposalDocument } from "@/model/proposal.model";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDb();

    try {
        if (req.method === 'GET') {
            return getProposalHandler(req, res);
        }
        if (req.method === 'PUT') {
            return updateProposalHandler(req, res);
        }
        res.status(200).json({ message: 'Received but not handled' });
    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}

async function getProposalHandler(req: NextApiRequest, res: NextApiResponse) {
    const { proposalId } = req.query as Record<string, string>;
    const proposal = await ProposalModel.findById(proposalId).lean();

    if (proposal) {
        return res.status(200).json({ proposal })
    } else {
        return res.status(404).json({ message: 'Proposal not found' });
    }
}


async function updateProposalHandler(req: NextApiRequest, res: NextApiResponse) {
    const { proposalId } = req.query as Record<string, string>;
    const { totalVotes, hasEnded, votes } = req.body;

    try {
        // Find the proposal by ID
        const proposal = await ProposalModel.findById(proposalId) as ProposalDocument;

        if (!proposal) {
            return res.status(404).json({ error: 'Proposal not found' });
        }

        // Conditionally update only if values are provided
        if (typeof totalVotes !== 'undefined') {
            proposal.totalVotes = totalVotes;
        }
        // Conditionally update only if values are provided
        if (typeof votes !== 'undefined') {
            proposal.votes = votes;
        }

        if (typeof hasEnded !== 'undefined') {
            proposal.hasEnded = hasEnded;
        }

        // Save only if something was updated
        if (proposal.isModified()) {
            await proposal.save();
        }

        return res.status(200).json({ proposal });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while updating the proposal' });
    }
}
