import mongoose from "mongoose";

const url = 'mongodb+srv://abdelramanmohamed34_db_user:24781011p@store.eizrnvi.mongodb.net/alazhar_university?retryWrites=true&w=majority'
let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function connectDB() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(url).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}