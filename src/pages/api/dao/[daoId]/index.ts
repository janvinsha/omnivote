import { NextApiRequest, NextApiResponse } from "next";
import connectDb from '../../../../model/db';
import DaoModel from "@/model/dao.model";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await connectDb();

    try {
        if (req.method === 'GET') {
            return getDaoHandler(req, res);
        }
        res.status(200).json({ message: 'Received but not handled' });
    } catch (e: any) {
        res.status(500).json({ message: e.message });
    }
}

async function getDaoHandler(req: NextApiRequest, res: NextApiResponse) {
    const { daoId } = req.query as Record<string, string>;
    const dao = await DaoModel.findById(daoId).lean();

    if (dao) {
        return res.status(200).json({ dao })
    } else {
        return res.status(404).json({ message: 'Dao not found' });
    }
}



