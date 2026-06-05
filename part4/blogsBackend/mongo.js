import mongoose from "mongoose";
import { MONGODB_URI } from "./utils/config.js";
import logger from "./utils/logger.js";
import { PORT } from "./utils/config.js";

const connectionString = async () => {
  try {
    await mongoose.connect(MONGODB_URI)
     if (process.env.NODE_ENV === "test") {
      console.log(`Connected to MongoDB (TEST MODE) - http://localhost:${PORT}`);
    } else {
      console.log(`Connected to MongoDB`);
    }

  } catch (error) {
    logger.err('error connecting to MongoDB:', error.message)
  }
}

export default connectionString