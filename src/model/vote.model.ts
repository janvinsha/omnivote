import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Define the base Vote interface
export interface IVote {
    ipfsHash: string;
    proposalId: string;
    voter: string;
    proposalAddress: string;
}

// Define the document interface which extends Mongoose's Document
export interface VoteDocument extends IVote, Document { }

// Create the schema for the Vote model
const voteSchema: Schema<VoteDocument> = new Schema(
    {
        proposalId: { type: String, required: true },
        proposalAddress: { type: String, required: true },
        ipfsHash: { type: String, required: true, trim: true },
        voter: { type: String, required: true, trim: true },
    },
    {
        timestamps: true,  // Automatically manages `createdAt` and `updatedAt`
        strict: true,      // Enforces strict schema validation
    }
);

// Create the Vote model or use the existing one
const VoteModel: Model<VoteDocument> = models.Vote || mongoose.model<VoteDocument>('Vote', voteSchema);

export default VoteModel;
