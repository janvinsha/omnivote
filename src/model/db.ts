import mongoose, { Mongoose } from 'mongoose';

// Ensure that the MONGODB_URI environment variable is set
const MONGODB_URI = (process.env.NEXT_PUBLIC_APP_ENV === "testnet" ? process.env.NEXT_PUBLIC_MONGODB_URI : process.env.NEXT_PUBLIC_MONGODB_URI_PROD) || "";

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

// Create a cached connection object to prevent multiple connections during development
interface MongooseCache {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

declare global {
    // This lets TypeScript know that `global` may have a `mongoose` property
    var mongoose: MongooseCache;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!cached) {
    cached = { conn: null, promise: null };
}

// Async function to connect to the MongoDB database
async function dbConnect() {
    // If already connected, return the connection
    if (cached.conn) {
        return cached.conn;
    }

    // If no promise is set, initiate a new connection
    if (!cached.promise) {
        const opts = {
            bufferCommands: false, // Disables buffering of commands while connection is pending
        };

        // Create a new connection promise
        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log('MongoDB connected successfully');
            seed(); // Optional: Implement seeding logic
            return mongoose;
        }).catch((error) => {
            cached.promise = null; // Reset promise if connection fails
            throw new Error(`MongoDB connection error: ${error.message}`);
        });
    }

    // Await the connection promise and cache the connection
    cached.conn = await cached.promise;
    return cached.conn;
}

// Placeholder for seeding the database
async function seed() {
    // Implement your database seeding logic here if needed
}

export default dbConnect;
