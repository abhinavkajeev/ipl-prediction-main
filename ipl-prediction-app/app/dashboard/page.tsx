"use client";

import { useEffect, useState } from "react";
import Navbar from "@/client/components/Navbar";
import { TeamWinChart, TossImpactChart, VenueChart, SeasonTrendChart } from "@/client/components/Charts";
import { fetchTeamStats, fetchVenueStats, fetchTossStats, fetchSeasonStats, fetchHeadToHead, fetchSummary } from "@/client/lib/api";
import { BarChart3, Trophy, RefreshCw } from "lucide-react";

export default function DashboardPage() {
     const [teamStats, setTeamStats] = useState([]);
     const [venueStats, setVenueStats] = useState([]);
     const [tossStats, setTossStats] = useState(null);
     const [seasonStats, setSeasonStats] = useState([]);
     const [teams, setTeams] = useState<string[]>([]);
     const [h2hTeam1, setH2hTeam1] = useState("");
     const [h2hTeam2, setH2hTeam2] = useState("");
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     const [headToHead, setHeadToHead] = useState<any>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          async function load() {
               try {
                    const [t, v, to, s, summary] = await Promise.all([
                         fetchTeamStats(), fetchVenueStats(), fetchTossStats(), fetchSeasonStats(), fetchSummary(),
                    ]);
                    setTeamStats(t);
                    setVenueStats(v);
                    setTossStats(to);
                    setSeasonStats(s);
                    setTeams(summary.teams || []);
               } catch (err) {
                    console.error("Failed to load dashboard data:", err);
               } finally {
                    setLoading(false);
               }
          }
          load();
     }, []);

     const loadH2H = async () => {
          if (!h2hTeam1 || !h2hTeam2 || h2hTeam1 === h2hTeam2) return;
          try {
               const data = await fetchHeadToHead(h2hTeam1, h2hTeam2);
               setHeadToHead(data);
          } catch (err) {
               console.error("H2H error:", err);
          }
     };

     if (loading) {
          return (
               <>
                    <Navbar />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 16 }}>
                         <div className="spinner" />
                         <p style={{ color: "#94a3b8" }}>Loading analytics...</p>
                    </div>
               </>
          );
     }

     return (
          <>
               <Navbar />
               <main style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
                    {/* Header */}
                    <div style={{ marginBottom: 32 }}>
                         <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                              <BarChart3 size={28} color="#f59e0b" />
                              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 32, color: "#f1f5f9" }}>
                                   Analytics Dashboard
                              </h1>
                         </div>
                         <p style={{ color: "#94a3b8", fontSize: 16 }}>
                              Explore IPL match data through interactive visualizations
                         </p>
                    </div>

                    {/* Charts Grid */}
                    <div style={{ display: "grid", gap: 24, marginBottom: 32 }}>
                         {/* Team Win Percentage */}
                         <div className="animate-fade-in-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
                              <TeamWinChart data={teamStats} />
                         </div>

                         {/* Toss + Venue */}
                         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
                              <div className="animate-fade-in-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
                                   {tossStats && <TossImpactChart data={tossStats} />}
                              </div>
                              <div className="animate-fade-in-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
                                   <VenueChart data={venueStats} />
                              </div>
                         </div>

                         {/* Season Trends */}
                         <div className="animate-fade-in-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
                              <SeasonTrendChart data={seasonStats} />
                         </div>
                    </div>

                    {/* Head to Head */}
                    <div className="glass-card animate-fade-in-up" style={{ padding: 28, animationDelay: "0.5s", opacity: 0 }}>
                         <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                              <Trophy size={20} color="#f59e0b" />
                              Head-to-Head Comparison
                         </h3>

                         <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                              <select className="select-input" style={{ flex: 1, minWidth: 180 }} value={h2hTeam1} onChange={(e) => setH2hTeam1(e.target.value)}>
                                   <option value="">Select Team 1</option>
                                   {teams.map((t) => <option key={t} value={t}>{t}</option>)}
                              </select>
                              <span style={{ display: "flex", alignItems: "center", color: "#94a3b8", fontSize: 14, fontWeight: 700 }}>VS</span>
                              <select className="select-input" style={{ flex: 1, minWidth: 180 }} value={h2hTeam2} onChange={(e) => setH2hTeam2(e.target.value)}>
                                   <option value="">Select Team 2</option>
                                   {teams.filter((t) => t !== h2hTeam1).map((t) => <option key={t} value={t}>{t}</option>)}
                              </select>
                              <button className="btn-primary" onClick={loadH2H} disabled={!h2hTeam1 || !h2hTeam2 || h2hTeam1 === h2hTeam2} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                   <RefreshCw size={16} /> Compare
                              </button>
                         </div>

                         {headToHead && (
                              <div className="animate-fade-in-up">
                                   <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 20, marginBottom: 20 }}>
                                        {/* Team 1 */}
                                        <div style={{ textAlign: "center" }}>
                                             <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8, color: "#f59e0b" }}>
                                                  {headToHead.team1}
                                             </div>
                                             <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 48, color: "#f1f5f9" }}>
                                                  {headToHead.team1Wins}
                                             </div>
                                             <div style={{ fontSize: 13, color: "#94a3b8" }}>wins</div>
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                                             <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>Total</div>
                                             <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 24, color: "#f1f5f9" }}>
                                                  {headToHead.totalMatches}
                                             </div>
                                             <div style={{ fontSize: 13, color: "#94a3b8" }}>matches</div>
                                        </div>

                                        {/* Team 2 */}
                                        <div style={{ textAlign: "center" }}>
                                             <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 8, color: "#3b82f6" }}>
                                                  {headToHead.team2}
                                             </div>
                                             <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 48, color: "#f1f5f9" }}>
                                                  {headToHead.team2Wins}
                                             </div>
                                             <div style={{ fontSize: 13, color: "#94a3b8" }}>wins</div>
                                        </div>
                                   </div>

                                   {/* Win bar */}
                                   {headToHead.totalMatches > 0 && (
                                        <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 5, overflow: "hidden", display: "flex", marginBottom: 20 }}>
                                             <div style={{ width: `${(headToHead.team1Wins / headToHead.totalMatches) * 100}%`, background: "linear-gradient(90deg, #f59e0b, #f97316)", borderRadius: "5px 0 0 5px" }} />
                                             <div style={{ width: `${(headToHead.team2Wins / headToHead.totalMatches) * 100}%`, background: "linear-gradient(90deg, #3b82f6, #8b5cf6)", borderRadius: "0 5px 5px 0" }} />
                                        </div>
                                   )}

                                   {/* Recent Matches */}
                                   {headToHead.recentMatches?.length > 0 && (
                                        <div>
                                             <h4 style={{ fontSize: 14, color: "#94a3b8", marginBottom: 10, fontWeight: 600 }}>Recent Matches</h4>
                                             <div style={{ display: "grid", gap: 8 }}>
                                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                  {headToHead.recentMatches.map((m: any, i: number) => (
                                                       <div key={i} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13 }}>
                                                            <span style={{ color: "#94a3b8" }}>{m.venue}</span>
                                                            <span style={{ fontWeight: 700, color: m.winner === headToHead.team1 ? "#f59e0b" : "#3b82f6" }}>{m.winner} won</span>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   )}
                              </div>
                         )}
                    </div>
               </main>
          </>
     );
}
