"use client";

import {
     BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
     PieChart, Pie, Cell, Legend,
     LineChart, Line,
} from "recharts";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f97316", "#06b6d4", "#ec4899", "#14b8a6", "#a855f7"];

interface TeamStat { team: string; winPercentage: number; played: number; won: number; }
interface VenueStat { venue: string; totalMatches: number; avgFirstInningsScore: number; batFirstWins: number; bowlFirstWins: number; }
interface TossStat { tossWinnerWonPercentage: number; batFirstWinPercentage: number; bowlFirstWinPercentage: number; totalMatches: number; batFirstDecisions: number; bowlFirstDecisions: number; }
interface SeasonStat { season: string; totalMatches: number; avgScore: number; highestScore: number; }

export function TeamWinChart({ data }: { data: TeamStat[] }) {
     const top10 = data.slice(0, 10);
     return (
          <div className="glass-card" style={{ padding: 24 }}>
               <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 20, color: "#f1f5f9" }}>
                    🏆 Team Win Percentage
               </h3>
               <ResponsiveContainer width="100%" height={380}>
                    <BarChart data={top10} layout="vertical" margin={{ left: 20, right: 20 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                         <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                         <YAxis type="category" dataKey="team" width={140} tick={{ fill: "#f1f5f9", fontSize: 12 }} />
                         <Tooltip
                              contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                              labelStyle={{ color: "#f59e0b" }}
                              formatter={(value) => [`${value}%`, "Win Rate"]}
                         />
                         <Bar dataKey="winPercentage" radius={[0, 6, 6, 0]}>
                              {top10.map((_, idx) => (
                                   <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                              ))}
                         </Bar>
                    </BarChart>
               </ResponsiveContainer>
          </div>
     );
}

export function TossImpactChart({ data }: { data: TossStat }) {
     const pieData = [
          { name: "Toss Winner Won", value: data.tossWinnerWonPercentage },
          { name: "Toss Winner Lost", value: 100 - data.tossWinnerWonPercentage },
     ];
     const decisionData = [
          { name: "Bat First Wins", value: data.batFirstWinPercentage },
          { name: "Bowl First Wins", value: data.bowlFirstWinPercentage },
     ];

     return (
          <div className="glass-card" style={{ padding: 24 }}>
               <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 20, color: "#f1f5f9" }}>
                    🪙 Toss Impact Analysis
               </h3>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                         <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, textAlign: "center" }}>Toss Winner&apos;s Match Result</p>
                         <ResponsiveContainer width="100%" height={220}>
                              <PieChart>
                                   <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                                        <Cell fill="#f59e0b" />
                                        <Cell fill="#374151" />
                                   </Pie>
                                   <Tooltip contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                                   <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                              </PieChart>
                         </ResponsiveContainer>
                    </div>
                    <div>
                         <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 8, textAlign: "center" }}>Decision Success Rate</p>
                         <ResponsiveContainer width="100%" height={220}>
                              <PieChart>
                                   <Pie data={decisionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                                        <Cell fill="#3b82f6" />
                                        <Cell fill="#10b981" />
                                   </Pie>
                                   <Tooltip contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                                   <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                              </PieChart>
                         </ResponsiveContainer>
                    </div>
               </div>
          </div>
     );
}

export function VenueChart({ data }: { data: VenueStat[] }) {
     const top8 = data.slice(0, 8);
     return (
          <div className="glass-card" style={{ padding: 24 }}>
               <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 20, color: "#f1f5f9" }}>
                    🏟️ Venue Statistics
               </h3>
               <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={top8} margin={{ bottom: 60 }}>
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                         <XAxis dataKey="venue" tick={{ fill: "#94a3b8", fontSize: 10 }} angle={-30} textAnchor="end" height={80} />
                         <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                         <Tooltip contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                         <Bar dataKey="avgFirstInningsScore" name="Avg 1st Innings" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                         <Bar dataKey="totalMatches" name="Total Matches" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                         <Legend wrapperStyle={{ fontSize: 12 }} />
                    </BarChart>
               </ResponsiveContainer>
          </div>
     );
}

export function SeasonTrendChart({ data }: { data: SeasonStat[] }) {
     return (
          <div className="glass-card" style={{ padding: 24 }}>
               <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 20, color: "#f1f5f9" }}>
                    📈 Season Trends
               </h3>
               <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                         <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                         <XAxis dataKey="season" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                         <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                         <Tooltip contentStyle={{ background: "#1a1f35", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                         <Line type="monotone" dataKey="avgScore" name="Avg Score" stroke="#f59e0b" strokeWidth={3} dot={{ fill: "#f59e0b", r: 5 }} />
                         <Line type="monotone" dataKey="highestScore" name="Highest Score" stroke="#ef4444" strokeWidth={2} dot={{ fill: "#ef4444", r: 4 }} strokeDasharray="5 5" />
                         <Line type="monotone" dataKey="totalMatches" name="Matches" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
                         <Legend wrapperStyle={{ fontSize: 12 }} />
                    </LineChart>
               </ResponsiveContainer>
          </div>
     );
}
