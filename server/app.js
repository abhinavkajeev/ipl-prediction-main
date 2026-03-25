const express = require("express");
const cors = require("cors");
const predictionRoutes = require("./routes/predictionRoutes");
const statsRoutes = require("./routes/statsRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/predict", predictionRoutes);
app.use("/api/stats", statsRoutes);

// Health check
app.get("/api/health", (req, res) => {
     res.json({ status: "ok", timestamp: new Date().toISOString() });
});

module.exports = app;
