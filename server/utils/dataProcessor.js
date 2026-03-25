const fs = require("fs");
const path = require("path");

const CSV_PATH = path.join(__dirname, "../../ml-model/dataset/matches.csv");

function parseCSV() {
     const raw = fs.readFileSync(CSV_PATH, "utf-8");
     const lines = raw.split("\n").filter((l) => l.trim());
     const headers = lines[0].split(",").map((h) => h.trim());

     // Handle CSV with commas inside quotes
     const records = [];
     for (let i = 1; i < lines.length; i++) {
          const values = [];
          let current = "";
          let inQuotes = false;
          for (const char of lines[i]) {
               if (char === '"') {
                    inQuotes = !inQuotes;
               } else if (char === "," && !inQuotes) {
                    values.push(current.trim());
                    current = "";
               } else {
                    current += char;
               }
          }
          values.push(current.trim());

          if (values.length >= headers.length) {
               const record = {};
               headers.forEach((h, idx) => {
                    record[h] = values[idx] || "";
               });
               records.push(record);
          }
     }
     return records;
}

const teamNameMap = {
     KXIP: "Punjab Kings",
     "Kings XI Punjab": "Punjab Kings",
     "Delhi Daredevils": "Delhi Capitals",
     "Deccan Chargers": "Sunrisers Hyderabad",
};

function normalizeTeam(name) {
     return teamNameMap[name] || name;
}

function getValidMatches() {
     const records = parseCSV();
     return records.filter(
          (r) =>
               r.winner &&
               r.winner !== "TBA" &&
               r.winner !== "TBC" &&
               r.home_team &&
               r.away_team &&
               !r.result?.includes("No result")
     );
}

function getTeamStats() {
     const matches = getValidMatches();
     const stats = {};

     matches.forEach((m) => {
          const home = normalizeTeam(m.home_team);
          const away = normalizeTeam(m.away_team);
          const winner = normalizeTeam(m.winner);

          [home, away].forEach((team) => {
               if (!stats[team])
                    stats[team] = { played: 0, won: 0, lost: 0, homeWins: 0, awayWins: 0, tossWins: 0 };
               stats[team].played++;
          });

          if (stats[winner]) {
               stats[winner].won++;
               if (winner === home) stats[winner].homeWins++;
               else stats[winner].awayWins++;
          }

          const loser = winner === home ? away : home;
          if (stats[loser]) stats[loser].lost++;

          const tossWinner = normalizeTeam(m.toss_won);
          if (stats[tossWinner]) stats[tossWinner].tossWins++;
     });

     return Object.entries(stats)
          .map(([team, s]) => ({
               team,
               ...s,
               winPercentage: s.played > 0 ? Math.round((s.won / s.played) * 100) : 0,
          }))
          .sort((a, b) => b.winPercentage - a.winPercentage);
}

function getVenueStats() {
     const matches = getValidMatches();
     const venues = {};

     matches.forEach((m) => {
          const venue = m.venue_name?.split(",")[0]?.trim() || "Unknown";
          if (!venues[venue])
               venues[venue] = {
                    totalMatches: 0,
                    avgFirstInningsScore: 0,
                    avgSecondInningsScore: 0,
                    batFirstWins: 0,
                    bowlFirstWins: 0,
                    scores: [],
               };

          venues[venue].totalMatches++;

          const firstScore = parseInt(m["1st_inning_score"]) || 0;
          const secondScore = parseInt(m["2nd_inning_score"]) || 0;
          if (firstScore > 0) venues[venue].scores.push({ first: firstScore, second: secondScore });

          if (m.decision && m.decision.includes("BAT")) {
               const tossWinner = normalizeTeam(m.toss_won);
               const winner = normalizeTeam(m.winner);
               if (tossWinner === winner) venues[venue].batFirstWins++;
               else venues[venue].bowlFirstWins++;
          } else if (m.decision && m.decision.includes("BOWL")) {
               const tossWinner = normalizeTeam(m.toss_won);
               const winner = normalizeTeam(m.winner);
               if (tossWinner === winner) venues[venue].bowlFirstWins++;
               else venues[venue].batFirstWins++;
          }
     });

     return Object.entries(venues)
          .filter(([, v]) => v.totalMatches >= 3)
          .map(([venue, v]) => {
               const avgFirst =
                    v.scores.length > 0
                         ? Math.round(v.scores.reduce((a, s) => a + s.first, 0) / v.scores.length)
                         : 0;
               const avgSecond =
                    v.scores.length > 0
                         ? Math.round(v.scores.reduce((a, s) => a + s.second, 0) / v.scores.length)
                         : 0;
               return {
                    venue,
                    totalMatches: v.totalMatches,
                    avgFirstInningsScore: avgFirst,
                    avgSecondInningsScore: avgSecond,
                    batFirstWins: v.batFirstWins,
                    bowlFirstWins: v.bowlFirstWins,
               };
          })
          .sort((a, b) => b.totalMatches - a.totalMatches);
}

function getTossStats() {
     const matches = getValidMatches();
     let tossWinnerWonMatch = 0;
     let batFirstDecisions = 0;
     let bowlFirstDecisions = 0;
     let batFirstWins = 0;
     let bowlFirstWins = 0;

     matches.forEach((m) => {
          const tossWinner = normalizeTeam(m.toss_won);
          const winner = normalizeTeam(m.winner);

          if (tossWinner === winner) tossWinnerWonMatch++;

          if (m.decision?.includes("BAT")) {
               batFirstDecisions++;
               if (tossWinner === winner) batFirstWins++;
          } else if (m.decision?.includes("BOWL")) {
               bowlFirstDecisions++;
               if (tossWinner === winner) bowlFirstWins++;
          }
     });

     return {
          totalMatches: matches.length,
          tossWinnerWonMatch,
          tossWinnerWonPercentage: Math.round((tossWinnerWonMatch / matches.length) * 100),
          batFirstDecisions,
          bowlFirstDecisions,
          batFirstWins,
          bowlFirstWins,
          batFirstWinPercentage:
               batFirstDecisions > 0 ? Math.round((batFirstWins / batFirstDecisions) * 100) : 0,
          bowlFirstWinPercentage:
               bowlFirstDecisions > 0 ? Math.round((bowlFirstWins / bowlFirstDecisions) * 100) : 0,
     };
}

function getSeasonStats() {
     const matches = getValidMatches();
     const seasons = {};

     matches.forEach((m) => {
          const season = m.season || "Unknown";
          if (season === "Unknown" || !season) return;

          if (!seasons[season])
               seasons[season] = {
                    totalMatches: 0,
                    avgScore: 0,
                    scores: [],
                    highestScore: 0,
                    lowestScore: 999,
               };

          seasons[season].totalMatches++;
          const score1 = parseInt(m["1st_inning_score"]) || 0;
          const score2 = parseInt(m["2nd_inning_score"]) || 0;
          if (score1 > 0) seasons[season].scores.push(score1);
          if (score2 > 0) seasons[season].scores.push(score2);
          if (score1 > seasons[season].highestScore) seasons[season].highestScore = score1;
          if (score2 > seasons[season].highestScore) seasons[season].highestScore = score2;
          if (score1 > 0 && score1 < seasons[season].lowestScore) seasons[season].lowestScore = score1;
          if (score2 > 0 && score2 < seasons[season].lowestScore) seasons[season].lowestScore = score2;
     });

     return Object.entries(seasons)
          .map(([season, s]) => ({
               season,
               totalMatches: s.totalMatches,
               avgScore:
                    s.scores.length > 0
                         ? Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length)
                         : 0,
               highestScore: s.highestScore,
               lowestScore: s.lowestScore === 999 ? 0 : s.lowestScore,
          }))
          .sort((a, b) => a.season.localeCompare(b.season));
}

function getHeadToHead(team1, team2) {
     const matches = getValidMatches();
     const t1 = normalizeTeam(team1);
     const t2 = normalizeTeam(team2);

     const headToHead = matches.filter((m) => {
          const home = normalizeTeam(m.home_team);
          const away = normalizeTeam(m.away_team);
          return (home === t1 && away === t2) || (home === t2 && away === t1);
     });

     let team1Wins = 0;
     let team2Wins = 0;
     const recentMatches = [];

     headToHead.forEach((m) => {
          const winner = normalizeTeam(m.winner);
          if (winner === t1) team1Wins++;
          else if (winner === t2) team2Wins++;

          recentMatches.push({
               date: m.start_date,
               venue: m.venue_name?.split(",")[0]?.trim(),
               winner,
               result: m.result,
          });
     });

     return {
          team1: t1,
          team2: t2,
          totalMatches: headToHead.length,
          team1Wins,
          team2Wins,
          recentMatches: recentMatches.slice(-5).reverse(),
     };
}

function getSummary() {
     const matches = getValidMatches();
     const teams = new Set();
     const venues = new Set();
     matches.forEach((m) => {
          teams.add(normalizeTeam(m.home_team));
          teams.add(normalizeTeam(m.away_team));
          if (m.venue_name) venues.add(m.venue_name.split(",")[0].trim());
     });

     return {
          totalMatches: matches.length,
          totalTeams: teams.size,
          totalVenues: venues.size,
          teams: Array.from(teams).sort(),
          seasons: [...new Set(matches.map((m) => m.season).filter(Boolean))].sort(),
     };
}

module.exports = {
     getTeamStats,
     getVenueStats,
     getTossStats,
     getSeasonStats,
     getHeadToHead,
     getSummary,
     getValidMatches,
};
