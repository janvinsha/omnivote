import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser {
    address: string;
}
export interface IUserWithId extends IUser {
    _id?: string;
}


export interface UserDocument extends IUser, Document { }

const userSchema: Schema = new Schema({
    _id: Schema.Types.ObjectId,
    address: { type: String, required: true }
}, {
    timestamps: true,
    strict: true
});

export const UserModel = models?.User || mongoose.model<UserDocument>('User', userSchema);
