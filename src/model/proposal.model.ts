import mongoose, { Schema, Document, models } from 'mongoose';

export interface IProposal {
    address: string;
}
export interface IDaoWithId extends IProposal {
    _id?: string;
    description?: string;
    startTime?: string;
    endTime?: string;
    totalVotes?: string;
}

export interface ProposalDocument extends IProposal, Document { }

const proposalSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    description: { type: String },
    startTime: { type: Number },
    endTime: { type: Number },
    totalVotes: { type: Number }
}, {
    timestamps: true,
    strict: true
});

export const ProposalModel = models?.Proposal || mongoose.model<ProposalDocument>('Proposal', proposalSchema);
