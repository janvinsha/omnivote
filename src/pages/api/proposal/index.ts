// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectDb from '../../../model/db';
import mongoose from 'mongoose';
import ProposalModel from '../../../model/proposal.model';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDb();

    try {
        if (req.method === 'GET') {
            return getAllProposals(req, res);
        }
        if (req.method === 'POST') {
            return createProposal(req, res);
        }

        res.status(200).json({ message: 'All good' });
    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}

async function getAllProposals(req: NextApiRequest, res: NextApiResponse) {
    const allProposals = await ProposalModel.find();
    console.log("ALL PROPOSALS", allProposals);
    return res.status(200).json({ proposals: allProposals });
}

async function createProposal(req: NextApiRequest, res: NextApiResponse) {
    console.log("THIS IS THE BODY", req.body);
    const { description, name, onChainID, startTime, endTime, mainChain, hasEnded, supportedChains, totalVotes, image, ownerAddress } = req.body
    // Validate required fields
    if (!name || !onChainID || !startTime || !endTime || !ownerAddress) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const proposal = new ProposalModel({
        name,
        description,
        startTime: new Date(startTime),  // Assuming startTime is a timestamp
        endTime: new Date(endTime),      // Assuming endTime is a timestamp
        mainChain,
        onChainID,
        ownerAddress,
        image,
        hasEnded: false,
        supportedChains,
        totalVotes: 0  // Default to 0 if not provided
    });

    console.log("THIS IS THE PROPOSAL BEFORE SAVING", proposal);

    try {
        const savedProposal = await proposal.save();
        return res.status(201).json({ proposal: savedProposal });
    } catch (e: any) {
        console.error(e);
        return res.status(400).json({ message: e.message });
    }
}
