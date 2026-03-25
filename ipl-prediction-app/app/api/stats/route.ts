import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CSV_PATH = path.join(process.cwd(), "ml-model", "dataset", "matches.csv");
const METADATA_PATH = path.join(process.cwd(), "ml-model", "metadata.json");

interface MatchRecord {
     [key: string]: string;
}

const teamNameMap: Record<string, string> = {
     KXIP: "Punjab Kings",
     "Kings XI Punjab": "Punjab Kings",
     "Delhi Daredevils": "Delhi Capitals",
     "Deccan Chargers": "Sunrisers Hyderabad",
};

function normalizeTeam(name: string): string {
     return teamNameMap[name] || name;
}

function parseCSV(): MatchRecord[] {
     const raw = fs.readFileSync(CSV_PATH, "utf-8");
     const lines = raw.split("\n").filter((l) => l.trim());
     const headers = lines[0].split(",").map((h) => h.trim().replace(/\r/g, ""));

     const records: MatchRecord[] = [];
     for (let i = 1; i < lines.length; i++) {
          const values: string[] = [];
          let current = "";
          let inQuotes = false;
          for (const char of lines[i]) {
               if (char === '"') inQuotes = !inQuotes;
               else if (char === "," && !inQuotes) { values.push(current.trim()); current = ""; }
               else current += char;
          }
          values.push(current.trim().replace(/\r/g, ""));

          if (values.length >= headers.length) {
               const record: MatchRecord = {};
               headers.forEach((h, idx) => { record[h] = values[idx] || ""; });
               records.push(record);
          }
     }
     return records;
}

function getValidMatches(): MatchRecord[] {
     return parseCSV().filter(
          (r) => r.winner && r.winner !== "TBA" && r.winner !== "TBC" && r.home_team && r.away_team && !r.result?.includes("No result")
     );
}

function getTeamStats() {
     const matches = getValidMatches();
     const stats: Record<string, { played: number; won: number; lost: number; homeWins: number; awayWins: number }> = {};

     matches.forEach((m) => {
          const home = normalizeTeam(m.home_team);
          const away = normalizeTeam(m.away_team);
          const winner = normalizeTeam(m.winner);

          [home, away].forEach((team) => {
               if (!stats[team]) stats[team] = { played: 0, won: 0, lost: 0, homeWins: 0, awayWins: 0 };
               stats[team].played++;
          });

          if (stats[winner]) {
               stats[winner].won++;
               if (winner === home) stats[winner].homeWins++;
               else stats[winner].awayWins++;
          }

          const loser = winner === home ? away : home;
          if (stats[loser]) stats[loser].lost++;
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
     const venues: Record<string, { totalMatches: number; batFirstWins: number; bowlFirstWins: number; scores: { first: number; second: number }[] }> = {};

     matches.forEach((m) => {
          const venue = m.venue_name?.split(",")[0]?.trim() || "Unknown";
          if (!venues[venue]) venues[venue] = { totalMatches: 0, batFirstWins: 0, bowlFirstWins: 0, scores: [] };
          venues[venue].totalMatches++;

          const s1 = parseInt(m["1st_inning_score"]) || 0;
          const s2 = parseInt(m["2nd_inning_score"]) || 0;
          if (s1 > 0) venues[venue].scores.push({ first: s1, second: s2 });

          const tw = normalizeTeam(m.toss_won);
          const w = normalizeTeam(m.winner);
          if (m.decision?.includes("BAT")) {
               if (tw === w) venues[venue].batFirstWins++; else venues[venue].bowlFirstWins++;
          } else if (m.decision?.includes("BOWL")) {
               if (tw === w) venues[venue].bowlFirstWins++; else venues[venue].batFirstWins++;
          }
     });

     return Object.entries(venues)
          .filter(([, v]) => v.totalMatches >= 3)
          .map(([venue, v]) => ({
               venue,
               totalMatches: v.totalMatches,
               avgFirstInningsScore: v.scores.length > 0 ? Math.round(v.scores.reduce((a, s) => a + s.first, 0) / v.scores.length) : 0,
               avgSecondInningsScore: v.scores.length > 0 ? Math.round(v.scores.reduce((a, s) => a + s.second, 0) / v.scores.length) : 0,
               batFirstWins: v.batFirstWins,
               bowlFirstWins: v.bowlFirstWins,
          }))
          .sort((a, b) => b.totalMatches - a.totalMatches);
}

function getTossStats() {
     const matches = getValidMatches();
     let tossWinnerWon = 0;
     let batFirst = 0; let bowlFirst = 0; let batWins = 0; let bowlWins = 0;

     matches.forEach((m) => {
          const tw = normalizeTeam(m.toss_won); const w = normalizeTeam(m.winner);
          if (tw === w) tossWinnerWon++;
          if (m.decision?.includes("BAT")) { batFirst++; if (tw === w) batWins++; }
          else if (m.decision?.includes("BOWL")) { bowlFirst++; if (tw === w) bowlWins++; }
     });

     return {
          totalMatches: matches.length, tossWinnerWon,
          tossWinnerWonPercentage: Math.round((tossWinnerWon / matches.length) * 100),
          batFirstDecisions: batFirst, bowlFirstDecisions: bowlFirst,
          batFirstWins: batWins, bowlFirstWins: bowlWins,
          batFirstWinPercentage: batFirst > 0 ? Math.round((batWins / batFirst) * 100) : 0,
          bowlFirstWinPercentage: bowlFirst > 0 ? Math.round((bowlWins / bowlFirst) * 100) : 0,
     };
}

function getSeasonStats() {
     const matches = getValidMatches();
     const seasons: Record<string, { totalMatches: number; scores: number[]; highest: number; lowest: number }> = {};

     matches.forEach((m) => {
          const season = m.season; if (!season) return;
          if (!seasons[season]) seasons[season] = { totalMatches: 0, scores: [], highest: 0, lowest: 999 };
          seasons[season].totalMatches++;
          [m["1st_inning_score"], m["2nd_inning_score"]].forEach((s) => {
               const n = parseInt(s) || 0;
               if (n > 0) { seasons[season].scores.push(n); if (n > seasons[season].highest) seasons[season].highest = n; if (n < seasons[season].lowest) seasons[season].lowest = n; }
          });
     });

     return Object.entries(seasons).map(([season, s]) => ({
          season, totalMatches: s.totalMatches,
          avgScore: s.scores.length > 0 ? Math.round(s.scores.reduce((a, b) => a + b, 0) / s.scores.length) : 0,
          highestScore: s.highest, lowestScore: s.lowest === 999 ? 0 : s.lowest,
     })).sort((a, b) => a.season.localeCompare(b.season));
}

function getHeadToHead(t1: string, t2: string) {
     const matches = getValidMatches();
     const n1 = normalizeTeam(t1); const n2 = normalizeTeam(t2);
     const h2h = matches.filter((m) => {
          const h = normalizeTeam(m.home_team); const a = normalizeTeam(m.away_team);
          return (h === n1 && a === n2) || (h === n2 && a === n1);
     });

     let w1 = 0; let w2 = 0;
     const recent = h2h.map((m) => {
          const winner = normalizeTeam(m.winner);
          if (winner === n1) w1++; else if (winner === n2) w2++;
          return { date: m.start_date, venue: m.venue_name?.split(",")[0]?.trim(), winner, result: m.result };
     });

     return { team1: n1, team2: n2, totalMatches: h2h.length, team1Wins: w1, team2Wins: w2, recentMatches: recent.slice(-5).reverse() };
}

function getSummary() {
     const matches = getValidMatches();
     const teams = new Set<string>(); const venues = new Set<string>();
     matches.forEach((m) => { teams.add(normalizeTeam(m.home_team)); teams.add(normalizeTeam(m.away_team)); if (m.venue_name) venues.add(m.venue_name.split(",")[0].trim()); });
     return { totalMatches: matches.length, totalTeams: teams.size, totalVenues: venues.size, teams: Array.from(teams).sort() };
}

export async function GET(request: Request) {
     const { searchParams } = new URL(request.url);
     const type = searchParams.get("type") || "summary";

     try {
          let data;
          switch (type) {
               case "teams": data = getTeamStats(); break;
               case "venues": data = getVenueStats(); break;
               case "toss": data = getTossStats(); break;
               case "seasons": data = getSeasonStats(); break;
               case "head-to-head":
                    const t1 = searchParams.get("team1") || "";
                    const t2 = searchParams.get("team2") || "";
                    if (!t1 || !t2) return NextResponse.json({ error: "team1 and team2 required" }, { status: 400 });
                    data = getHeadToHead(t1, t2);
                    break;
               case "metadata":
                    try { data = JSON.parse(fs.readFileSync(METADATA_PATH, "utf-8")); } catch { data = {}; }
                    break;
               default: data = getSummary();
          }
          return NextResponse.json(data);
     } catch (error) {
          return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
     }
}
