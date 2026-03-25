const API_BASE = "";

export async function fetchStats(type: string, params?: Record<string, string>) {
     const url = new URL(`${API_BASE}/api/stats`, window.location.origin);
     url.searchParams.set("type", type);
     if (params) {
          Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
     }

     const res = await fetch(url.toString());
     if (!res.ok) throw new Error("Failed to fetch stats");
     return res.json();
}

export async function fetchPrediction(data: {
     team1: string;
     team2: string;
     venue: string;
     toss_winner: string;
     toss_decision: string;
}) {
     const res = await fetch(`${API_BASE}/api/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
     });
     if (!res.ok) throw new Error("Prediction failed");
     return res.json();
}

export async function fetchSummary() {
     return fetchStats("summary");
}

export async function fetchTeamStats() {
     return fetchStats("teams");
}

export async function fetchVenueStats() {
     return fetchStats("venues");
}

export async function fetchTossStats() {
     return fetchStats("toss");
}

export async function fetchSeasonStats() {
     return fetchStats("seasons");
}

export async function fetchHeadToHead(team1: string, team2: string) {
     return fetchStats("head-to-head", { team1, team2 });
}

export async function fetchMetadata() {
     return fetchStats("metadata");
}
