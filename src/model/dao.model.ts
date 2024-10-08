import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Define the base DAO interface
export interface IDao {
    onChainID: string;
    ownerAddress: string;
    name?: string;
    description?: string;
    image?: string;
    mainChain?: string;
    supportedChains?: string[];
}

// Define the document interface which extends Mongoose's Document
export interface DaoDocument extends IDao, Document { }

// Create the schema for the DAO model
const daoSchema: Schema<DaoDocument> = new Schema(
    {
        onChainID: { type: String, required: true },
        ownerAddress: { type: String, required: true },
        name: { type: String, trim: true, minlength: 2, maxlength: 100 },
        description: { type: String, trim: true, maxlength: 500 },
        image: { type: String, trim: true },
        mainChain: { type: String, trim: true },
        supportedChains: [{ type: String, trim: true }],
    },
    {
        timestamps: true,  // Automatically manage `createdAt` and `updatedAt` fields
        strict: true,      // Ensure strict schema validation
    }
);

// Create the model if it doesn't exist already
const DaoModel: Model<DaoDocument> = models?.Dao || mongoose.model<DaoDocument>('Dao', daoSchema);

export default DaoModel;
