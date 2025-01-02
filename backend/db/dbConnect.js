import mongoose from "mongoose";

const dbConnect = async () => {
    try {
     const connect = await mongoose.connect(process.env.MONGO_URI);
     console.log(`MongoDB connected: ${connect.connection.host} and the datebase is ${connect.connection.name}`);
    }
    catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default dbConnect;