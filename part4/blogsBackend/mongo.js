import mongoose from "mongoose";
import { MONGODB_URI } from "./utils/config.js";

const connectionString = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('connected to MongoDB')
  } catch (error) {
    console.log('error connecting to MongoDB:', error.message)
  }
}

export default connectionString