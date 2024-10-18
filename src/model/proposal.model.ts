import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Define the base Proposal interface
export interface IProposal {
    name: string;
    onChainID: string;
    daoId: string;
    ownerAddress: string;
    description?: string;
    startTime?: number;  // or Date if using Date
    endTime?: number;    // or Date if using Date
    mainChain?: string;
    image?: string;
    hasEnded?: boolean;
    totalVotes?: number;
    votes?: { yes: number, no: number, abstain: number };
    supportedChains?: string[];

}

// Define the document interface which extends Mongoose's Document
export interface ProposalDocument extends IProposal, Document { }

// Create the schema for the Proposal model
const proposalSchema: Schema<ProposalDocument> = new Schema(
    {
        name: { type: String, required: true },
        daoId: { type: String, required: true },
        onChainID: { type: String, required: true, trim: true },
        ownerAddress: { type: String, required: true, trim: true },
        description: { type: String, trim: true, maxlength: 500 },
        startTime: { type: Number, required: true },
        endTime: { type: Number, required: true },
        image: { type: String, trim: true },
        mainChain: { type: String, trim: true },
        hasEnded: { type: Boolean, default: false },
        supportedChains: [{ type: String, trim: true }],
        totalVotes: { type: Number, default: 0 },
        votes: {
            yes: { type: Number, default: 0, min: 0 },
            no: { type: Number, default: 0, min: 0 },
            abstain: { type: Number, default: 0, min: 0 },
        },
    },
    {
        timestamps: true,  // Automatically manages `createdAt` and `updatedAt`
        strict: true,      // Enforces strict schema validation
    }
);

// Create the Proposal model or use the existing one
const ProposalModel: Model<ProposalDocument> = models.Proposal || mongoose.model<ProposalDocument>('Proposal', proposalSchema);

export default ProposalModel;
