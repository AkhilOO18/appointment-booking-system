const mongoose = require("mongoose");

// Connects to MongoDB using the URI from the .env file.
// If this fails, the most common reasons are:
//  - MongoDB isn't running locally, OR
//  - your Atlas connection string / password is wrong, OR
//  - your IP isn't whitelisted in Atlas (Network Access tab)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
