import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

export const dbConnect = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URL, {
            dbName: "e-commerce",
            bufferCommands: false,
        })
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
