// Match data schema (for optional MongoDB storage)
const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
     season: String,
     matchId: Number,
     homeTeam: String,
     awayTeam: String,
     venue: String,
     tossWon: String,
     decision: String,
     winner: String,
     result: String,
     firstInningsScore: String,
     secondInningsScore: String,
     date: Date,
});

module.exports = mongoose.models.Match || mongoose.model("Match", matchSchema);
