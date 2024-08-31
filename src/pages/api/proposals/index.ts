// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectDb from '../../../model/db';
import mongoose from 'mongoose';
import { ProposalModel } from '../../../model/proposal.model';

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
    const allUsers = await ProposalModel.find();
    return res.status(200).json({ users: allUsers });
}

async function createProposal(req: NextApiRequest, res: NextApiResponse) {
    const proposal = new ProposalModel;
    proposal.name = req.body.name;
    proposal.description = req.body.description;
    proposal._id = new mongoose.Types.ObjectId();
    proposal.startTime = req.body.startTime;
    proposal.endTime = req.body.endTime;
    proposal.hasEnded = req.body.hasEnded;


    try {
        const savedProposal = await proposal.save();

        return res.status(201).json({ user: savedProposal });
    } catch (e: any) {
        return res.status(400).json({ message: e.message });
    }

}
