const {
     getTeamStats,
     getVenueStats,
     getTossStats,
     getSeasonStats,
     getHeadToHead,
     getSummary,
} = require("../utils/dataProcessor");

function teams(req, res) {
     try {
          res.json(getTeamStats());
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
}

function venues(req, res) {
     try {
          res.json(getVenueStats());
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
}

function toss(req, res) {
     try {
          res.json(getTossStats());
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
}

function seasons(req, res) {
     try {
          res.json(getSeasonStats());
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
}

function headToHead(req, res) {
     try {
          const { team1, team2 } = req.query;
          if (!team1 || !team2) {
               return res.status(400).json({ error: "team1 and team2 query params required" });
          }
          res.json(getHeadToHead(team1, team2));
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
}

function summary(req, res) {
     try {
          res.json(getSummary());
     } catch (error) {
          res.status(500).json({ error: error.message });
     }
}

module.exports = { teams, venues, toss, seasons, headToHead, summary };
