"use client";

import { useEffect, useState } from "react";
import Navbar from "@/client/components/Navbar";
import { fetchSummary } from "@/client/lib/api";
import Link from "next/link";
import { BarChart3, Target, Trophy, Users, MapPin, Calendar } from "lucide-react";

interface Summary {
  totalMatches: number;
  totalTeams: number;
  totalVenues: number;
  teams: string[];
}

export default function HomePage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetchSummary().then(setSummary).catch(console.error);
  }, []);

  const stats = [
    { label: "Total Matches", value: summary?.totalMatches || "—", icon: Calendar, color: "#f59e0b" },
    { label: "Teams", value: summary?.totalTeams || "—", icon: Users, color: "#3b82f6" },
    { label: "Venues", value: summary?.totalVenues || "—", icon: MapPin, color: "#10b981" },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "80px 24px 60px",
            textAlign: "center",
          }}
        >
          {/* Animated background orbs */}
          <div
            style={{
              position: "absolute",
              top: -100,
              left: "20%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "float 6s ease-in-out infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -50,
              right: "15%",
              width: 350,
              height: 350,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
              animation: "float 8s ease-in-out infinite reverse",
            }}
          />

          <div style={{ position: "relative", maxWidth: 800, margin: "0 auto" }}>
            <div
              style={{
                display: "inline-block",
                padding: "6px 16px",
                borderRadius: 20,
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                fontSize: 13,
                fontWeight: 600,
                color: "#f59e0b",
                marginBottom: 24,
                letterSpacing: "0.5px",
              }}
            >
              🏏 AI-Powered Cricket Analytics
            </div>

            <h1
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: "clamp(36px, 6vw, 64px)",
                lineHeight: 1.1,
                marginBottom: 20,
                letterSpacing: "-1px",
              }}
            >
              <span style={{ color: "#f1f5f9" }}>IPL Match </span>
              <span className="gradient-text">Predictor</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(16px, 2vw, 20px)",
                color: "#94a3b8",
                lineHeight: 1.6,
                marginBottom: 40,
                maxWidth: 600,
                margin: "0 auto 40px",
              }}
            >
              Analyze historical IPL data, explore team statistics, venue patterns, and predict match outcomes
              with our machine learning model.
            </p>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/dashboard" style={{ textDecoration: "none" }}>
                <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <BarChart3 size={18} />
                  Explore Dashboard
                </button>
              </Link>
              <Link href="/prediction" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 32px",
                    borderRadius: 12,
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    background: "rgba(245, 158, 11, 0.08)",
                    color: "#f59e0b",
                    fontWeight: 600,
                    fontSize: 16,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Target size={18} />
                  Predict Match
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="glass-card animate-fade-in-up"
                  style={{
                    padding: 28,
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    animationDelay: `${i * 0.15}s`,
                    opacity: 0,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: `${stat.color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={26} color={stat.color} />
                  </div>
                  <div>
                    <div
                      className="stat-number"
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 800,
                        fontSize: 32,
                        color: "#f1f5f9",
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 14, color: "#94a3b8", marginTop: 4 }}>{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: 28,
              textAlign: "center",
              marginBottom: 40,
              color: "#f1f5f9",
            }}
          >
            What You Can Do
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {[
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                desc: "Explore team performances, venue statistics, toss impact analysis, and season trends through interactive charts.",
                color: "#3b82f6",
                href: "/dashboard",
              },
              {
                icon: Target,
                title: "Match Prediction",
                desc: "Input match parameters like teams, venue, and toss details to get AI-powered winner predictions with probability scores.",
                color: "#f59e0b",
                href: "/prediction",
              },
              {
                icon: Trophy,
                title: "Head-to-Head",
                desc: "Compare any two teams with detailed head-to-head statistics and recent match history.",
                color: "#10b981",
                href: "/dashboard",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link key={i} href={feature.href} style={{ textDecoration: "none" }}>
                  <div
                    className="glass-card"
                    style={{
                      padding: 28,
                      cursor: "pointer",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: `${feature.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <Icon size={24} color={feature.color} />
                    </div>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8, color: "#f1f5f9" }}>
                      {feature.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.6 }}>{feature.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer
          style={{
            textAlign: "center",
            padding: "24px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "#64748b",
            fontSize: 13,
          }}
        >
          IPL Match Data Analysis & Winner Prediction • Built with Next.js, Python ML & Recharts
        </footer>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
      `}</style>
    </>
  );
}
