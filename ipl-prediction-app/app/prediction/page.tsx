"use client";

import { useEffect, useState } from "react";
import Navbar from "@/client/components/Navbar";
import PredictionForm from "@/client/components/PredictionForm";
import { fetchSummary, fetchMetadata } from "@/client/lib/api";
import { Target, Brain, Database, Zap } from "lucide-react";

export default function PredictionPage() {
     const [teams, setTeams] = useState<string[]>([]);
     const [venues, setVenues] = useState<string[]>([]);
     const [metadata, setMetadata] = useState<{ accuracy?: number; total_matches?: number } | null>(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          async function load() {
               try {
                    const [summary, meta] = await Promise.all([fetchSummary(), fetchMetadata()]);
                    setTeams(summary.teams || []);
                    setVenues(meta.venues || []);
                    setMetadata(meta);
               } catch (err) {
                    console.error("Failed to load:", err);
               } finally {
                    setLoading(false);
               }
          }
          load();
     }, []);

     if (loading) {
          return (
               <>
                    <Navbar />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", flexDirection: "column", gap: 16 }}>
                         <div className="spinner" />
                         <p style={{ color: "#94a3b8" }}>Loading prediction engine...</p>
                    </div>
               </>
          );
     }

     return (
          <>
               <Navbar />
               <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>
                    {/* Header */}
                    <div style={{ marginBottom: 32 }}>
                         <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                              <Target size={28} color="#f59e0b" />
                              <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 32, color: "#f1f5f9" }}>
                                   Match Prediction
                              </h1>
                         </div>
                         <p style={{ color: "#94a3b8", fontSize: 16, maxWidth: 600 }}>
                              Select match parameters to get an AI-powered prediction of the likely winner
                         </p>
                    </div>

                    {/* Model Info Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
                         {[
                              { icon: Brain, label: "Model", value: "Random Forest", color: "#8b5cf6" },
                              { icon: Database, label: "Training Data", value: `${metadata?.total_matches || 1000}+ matches`, color: "#3b82f6" },
                              { icon: Zap, label: "Accuracy", value: `${((metadata?.accuracy || 0.54) * 100).toFixed(0)}%`, color: "#f59e0b" },
                         ].map((card, i) => {
                              const Icon = card.icon;
                              return (
                                   <div key={i} className="glass-card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 14 }}>
                                        <div style={{ width: 42, height: 42, borderRadius: 10, background: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                             <Icon size={20} color={card.color} />
                                        </div>
                                        <div>
                                             <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{card.label}</div>
                                             <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16, color: "#f1f5f9" }}>{card.value}</div>
                                        </div>
                                   </div>
                              );
                         })}
                    </div>

                    {/* Prediction Form */}
                    <PredictionForm teams={teams} venues={venues} />

                    {/* Disclaimer */}
                    <div
                         style={{
                              marginTop: 32,
                              padding: "16px 20px",
                              borderRadius: 12,
                              background: "rgba(245, 158, 11, 0.06)",
                              border: "1px solid rgba(245, 158, 11, 0.15)",
                              fontSize: 13,
                              color: "#94a3b8",
                              lineHeight: 1.6,
                         }}
                    >
                         <strong style={{ color: "#f59e0b" }}>⚠️ Disclaimer:</strong> Predictions are based on historical data patterns and should be treated as statistical insights, not guarantees. Cricket is an unpredictable sport and many factors beyond historical data influence match outcomes.
                    </div>
               </main>
          </>
     );
}
