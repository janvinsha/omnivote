import mongoose, { Schema, Document, models } from 'mongoose';

export interface IVote {
    address: string;
}
export interface IVoteWithId extends IVote {
    _id?: string;
}

export interface VoteDocument extends IVote, Document { }

const voteSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    address: { type: String, required: true }
}, {
    timestamps: true,
    strict: true
});

export const VoteModel = models?.Vote || mongoose.model<VoteDocument>('Vote', voteSchema);
