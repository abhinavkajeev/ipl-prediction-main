// MongoDB connection configuration (optional)
// Fill in MONGODB_URI in .env to enable

const mongoose = require("mongoose");

async function connectDB() {
     const uri = process.env.MONGODB_URI;
     if (!uri) {
          console.log("MongoDB URI not provided. Running without database.");
          return null;
     }

     try {
          await mongoose.connect(uri);
          console.log("Connected to MongoDB");
          return mongoose.connection;
     } catch (error) {
          console.error("MongoDB connection error:", error.message);
          return null;
     }
}

module.exports = { connectDB };
