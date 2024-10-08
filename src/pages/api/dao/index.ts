// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import connectDb from '../../../model/db';
import mongoose from 'mongoose';
import DaoModel from '../../../model/dao.model';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDb();

    try {
        if (req.method === 'GET') {
            return getAllDaos(req, res);
        }
        if (req.method === 'POST') {
            return createDao(req, res);
        }

        res.status(200).json({ message: 'All good' });
    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}

async function getAllDaos(req: NextApiRequest, res: NextApiResponse) {
    const allDaos = await DaoModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ daos: allDaos });
}

async function createDao(req: NextApiRequest, res: NextApiResponse) {
    const dao = new DaoModel();
    dao.ownerAddress = req.body.ownerAddress;
    dao.description = req.body.description;
    dao.mainChain = req.body.mainChain;
    dao.image = req.body.image;
    dao.supportedChains = req.body.supportedChains;
    dao.name = req.body.name;
    dao.onChainID = req.body.onChainID;
    dao._id = new mongoose.Types.ObjectId();

    try {
        const savedDao = await dao.save();

        return res.status(201).json({ dao: savedDao });
    } catch (e: any) {
        return res.status(400).json({ message: e.message });
    }

}
