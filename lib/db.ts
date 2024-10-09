import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI)
  throw new Error("Please define the MONGODB_URI environment variable");

const connectDB = async () => {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log("Server is Online");
};

export default connectDB;
