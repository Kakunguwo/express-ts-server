import mongoose from "mongoose";

import "dotenv/config";


const connectDatabase = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URL}`)
        console.log(`database connected on host ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("Failed to connect to database");
        process.exit(1)
    }
}

export default connectDatabase;