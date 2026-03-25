"use client";

import { useState } from "react";
import { Target, TrendingUp, Loader2 } from "lucide-react";
import { fetchPrediction } from "../lib/api";

interface PredictionFormProps {
     teams: string[];
     venues: string[];
}

interface PredictionResult {
     winner: string;
     loser: string;
     probability: number;
     team1_win_prob: number;
     team2_win_prob: number;
     factors: string[];
     team1: string;
     team2: string;
}

export default function PredictionForm({ teams, venues }: PredictionFormProps) {
     const [team1, setTeam1] = useState("");
     const [team2, setTeam2] = useState("");
     const [venue, setVenue] = useState("");
     const [tossWinner, setTossWinner] = useState("");
     const [tossDecision, setTossDecision] = useState("");
     const [loading, setLoading] = useState(false);
     const [result, setResult] = useState<PredictionResult | null>(null);
     const [error, setError] = useState("");

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!team1 || !team2 || !venue || !tossWinner || !tossDecision) {
               setError("Please fill in all fields");
               return;
          }
          if (team1 === team2) {
               setError("Please select two different teams");
               return;
          }

          setLoading(true);
          setError("");
          setResult(null);

          try {
               const pred = await fetchPrediction({
                    team1,
                    team2,
                    venue,
                    toss_winner: tossWinner,
                    toss_decision: tossDecision,
               });
               setResult(pred);
          } catch {
               setError("Prediction failed. Please try again.");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div>
               {/* Form */}
               <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 32, marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 22, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                         <Target size={24} color="#f59e0b" />
                         Match Prediction
                    </h2>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                         {/* Team 1 */}
                         <div>
                              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                   Team 1 (Home)
                              </label>
                              <select className="select-input" value={team1} onChange={(e) => setTeam1(e.target.value)}>
                                   <option value="">Select Team</option>
                                   {teams.map((t) => (<option key={t} value={t}>{t}</option>))}
                              </select>
                         </div>

                         {/* Team 2 */}
                         <div>
                              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                   Team 2 (Away)
                              </label>
                              <select className="select-input" value={team2} onChange={(e) => setTeam2(e.target.value)}>
                                   <option value="">Select Team</option>
                                   {teams.filter((t) => t !== team1).map((t) => (<option key={t} value={t}>{t}</option>))}
                              </select>
                         </div>
                    </div>

                    {/* Venue */}
                    <div style={{ marginBottom: 20 }}>
                         <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                              Venue
                         </label>
                         <select className="select-input" value={venue} onChange={(e) => setVenue(e.target.value)}>
                              <option value="">Select Venue</option>
                              {venues.map((v) => (<option key={v} value={v}>{v}</option>))}
                         </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                         {/* Toss Winner */}
                         <div>
                              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                   Toss Winner
                              </label>
                              <select className="select-input" value={tossWinner} onChange={(e) => setTossWinner(e.target.value)} disabled={!team1 || !team2}>
                                   <option value="">Select Toss Winner</option>
                                   {team1 && <option value={team1}>{team1}</option>}
                                   {team2 && <option value={team2}>{team2}</option>}
                              </select>
                         </div>

                         {/* Toss Decision */}
                         <div>
                              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                   Toss Decision
                              </label>
                              <select className="select-input" value={tossDecision} onChange={(e) => setTossDecision(e.target.value)}>
                                   <option value="">Select Decision</option>
                                   <option value="BAT FIRST">Bat First</option>
                                   <option value="BOWL FIRST">Bowl First</option>
                              </select>
                         </div>
                    </div>

                    {error && (
                         <p style={{ color: "#ef4444", fontSize: 14, marginBottom: 16, padding: "10px 16px", background: "rgba(239,68,68,0.1)", borderRadius: 8 }}>
                              {error}
                         </p>
                    )}

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                         {loading ? (
                              <>
                                   <Loader2 size={20} className="spinner" style={{ animation: "spin 0.8s linear infinite" }} />
                                   Analyzing...
                              </>
                         ) : (
                              <>
                                   <TrendingUp size={20} />
                                   Predict Winner
                              </>
                         )}
                    </button>
               </form>

               {/* Result */}
               {result && (
                    <div className="glass-card glow-pulse animate-fade-in-up" style={{ padding: 32, textAlign: "center" }}>
                         <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#94a3b8", marginBottom: 12 }}>
                              Predicted Winner
                         </h3>
                         <div
                              className="gradient-text"
                              style={{
                                   fontFamily: "'Outfit', sans-serif",
                                   fontWeight: 900,
                                   fontSize: 36,
                                   marginBottom: 20,
                              }}
                         >
                              🏆 {result.winner}
                         </div>

                         {/* Probability bar */}
                         <div style={{ marginBottom: 24 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                   <span style={{ fontSize: 14, fontWeight: 600, color: "#f59e0b" }}>{result.team1}</span>
                                   <span style={{ fontSize: 14, fontWeight: 600, color: "#3b82f6" }}>{result.team2}</span>
                              </div>
                              <div style={{ height: 12, background: "rgba(255,255,255,0.05)", borderRadius: 6, overflow: "hidden", display: "flex" }}>
                                   <div
                                        style={{
                                             width: `${result.team1_win_prob}%`,
                                             background: "linear-gradient(90deg, #f59e0b, #f97316)",
                                             borderRadius: "6px 0 0 6px",
                                             transition: "width 1s ease",
                                        }}
                                   />
                                   <div
                                        style={{
                                             width: `${result.team2_win_prob}%`,
                                             background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                                             borderRadius: "0 6px 6px 0",
                                             transition: "width 1s ease",
                                        }}
                                   />
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                                   <span style={{ fontSize: 20, fontWeight: 800, color: "#f59e0b" }}>{result.team1_win_prob}%</span>
                                   <span style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>{result.team2_win_prob}%</span>
                              </div>
                         </div>

                         {/* Factors */}
                         <div style={{ textAlign: "left" }}>
                              <h4 style={{ fontSize: 14, fontWeight: 600, color: "#94a3b8", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                   Key Factors
                              </h4>
                              <div style={{ display: "grid", gap: 8 }}>
                                   {result.factors.map((f, i) => (
                                        <div
                                             key={i}
                                             style={{
                                                  fontSize: 14,
                                                  color: "#f1f5f9",
                                                  padding: "10px 14px",
                                                  background: "rgba(255,255,255,0.03)",
                                                  borderRadius: 8,
                                                  borderLeft: "3px solid #f59e0b",
                                             }}
                                        >
                                             {f}
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
