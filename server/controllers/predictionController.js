const { runPrediction } = require("../services/mlService");

async function predict(req, res) {
     try {
          const { team1, team2, venue, toss_winner, toss_decision } = req.body;

          if (!team1 || !team2 || !venue || !toss_winner || !toss_decision) {
               return res.status(400).json({ error: "All fields are required" });
          }

          const result = await runPrediction({ team1, team2, venue, toss_winner, toss_decision });

          if (result.error) {
               return res.status(500).json({ error: result.error });
          }

          res.json(result);
     } catch (error) {
          console.error("Prediction error:", error);
          res.status(500).json({ error: "Prediction failed" });
     }
}

module.exports = { predict };
