import mongoose from 'mongoose';

export async function connectToDatabase(connectionURI: string) {
    await mongoose.connect(connectionURI).then(() => {
        console.log(`[Database] Connected to database.`);
    }).catch((err) => {
        console.error(`[Database] Failed to connect to database.`, err);
    });
}