import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Define the base Proposal interface
export interface IProposal {
    onChainID: string;
    description?: string;
    startTime?: number;
    endTime?: number;
    hasEnded?: boolean;
    totalVotes?: number;
}

// Define the document interface which extends Mongoose's Document
export interface ProposalDocument extends IProposal, Document { }

// Create the schema for the Proposal model
const proposalSchema: Schema<ProposalDocument> = new Schema(
    {
        onChainID: { type: String, required: true, trim: true },
        description: { type: String, trim: true, maxlength: 500 },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        hasEnded: { type: Boolean, default: false },
        totalVotes: { type: Number, default: 0 },
    },
    {
        timestamps: true,  // Automatically manages `createdAt` and `updatedAt`
        strict: true,      // Enforces strict schema validation
    }
);

// Create the Proposal model or use the existing one
const ProposalModel: Model<ProposalDocument> = models?.Proposal || mongoose.model<ProposalDocument>('Proposal', proposalSchema);

export default ProposalModel;
