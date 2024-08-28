import mongoose, { Schema, Document, models } from 'mongoose';

export interface IDao {
    address: string;
}
export interface IDaoWithId extends IDao {
    _id?: string;
}


export interface DaoDocument extends IDao, Document { }

const daoSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    address: { type: String, required: true },
    name: { type: String },
    description: { type: String },
    ipfsMetadataHash: { type: String }
    // tokenAddress: { type: String },
    // minimumTokens: { type: String }
}, {
    timestamps: true,
    strict: true
});

export const DaoModel = models?.Dao || mongoose.model<DaoDocument>('Dao', daoSchema);
