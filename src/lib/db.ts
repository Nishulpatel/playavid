// Import the mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Get the MongoDB connection URI from environment variables
const MONODB_URI = process.env.MONGODB_URI!;

// If MONODB_URI is not provided, throw an error
// This helps prevent running the app without a database connection string
if (!MONODB_URI) {
    throw new Error('MONGODB_URI is not defined');
}

// Reuse a cached connection to avoid multiple connections in development (like during hot reloads)
let cached = global.mongoose;

// If no cached connection exists, create a new cache object
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB and return the connection.
 * Reuses cached connection if already established.
 * Caches the promise to prevent duplicate connections when multiple calls are made simultaneously.
 */
export async function connectToDb() {
    // If already connected, return the existing connection
    if (cached.conn) {
        return cached.conn;
    }

    // If there's no promise in progress, start a new connection attempt
    if (!cached.promise) {
        // Mongoose connection options:
        // bufferCommands: true allows queuing of operations while the connection is being established
        // maxPoolSize: 10 limits the number of concurrent socket connections
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        };

        // Start connecting and cache the promise
        cached.promise = mongoose
            .connect(MONODB_URI, opts)
            .then(() => mongoose.connection);
    }

    try {
        // Wait for the promise to resolve and cache the connection
        cached.conn = await cached.promise;
    } catch (error) {
        // If connection fails, clear the promise so that next time a fresh attempt is made
        cached.promise = null;
        throw error;
    }

    // Return the established connection
    return cached.conn;
}
