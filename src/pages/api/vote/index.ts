// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectDb from '../../../model/db';
import VoteModel from '../../../model/vote.model';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDb();

    try {
        if (req.method === 'GET') {
            return getAllVotes(req, res);
        }
        if (req.method === 'POST') {
            return createVote(req, res);
        }

        res.status(200).json({ message: 'All good' });
    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}

async function getAllVotes(req: NextApiRequest, res: NextApiResponse) {
    const { proposalId, voter } = req.query;
    let query: { proposalId?: string; voter?: string } = {};
    if (proposalId) query.proposalId = proposalId as string;
    if (voter) query.voter = voter as string;
    const allVotes = await VoteModel.find(query);
    return res.status(200).json({ votes: allVotes });
}

async function createVote(req: NextApiRequest, res: NextApiResponse) {
    const { ipfsHash, proposalId, voter, proposalAddress } = req.body
    // Validate required fields
    if (!ipfsHash || !proposalId || !voter || !proposalAddress) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const vote = new VoteModel({
        ipfsHash, proposalId, voter, proposalAddress
    });

    try {
        const savedVote = await vote.save();
        return res.status(201).json({ proposal: savedVote });
    } catch (e: any) {
        console.error(e);
        return res.status(400).json({ message: e.message });
    }
}