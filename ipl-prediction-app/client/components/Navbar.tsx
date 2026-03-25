"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Trophy, BarChart3, Target, Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
     { href: "/", label: "Home", icon: Trophy },
     { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
     { href: "/prediction", label: "Predict", icon: Target },
];

export default function Navbar() {
     const pathname = usePathname();
     const [isOpen, setIsOpen] = useState(false);

     return (
          <nav
               style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    background: "rgba(10, 14, 26, 0.85)",
                    backdropFilter: "blur(20px)",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
               }}
          >
               <div
                    style={{
                         maxWidth: 1280,
                         margin: "0 auto",
                         padding: "0 24px",
                         display: "flex",
                         alignItems: "center",
                         justifyContent: "space-between",
                         height: 72,
                    }}
               >
                    {/* Logo */}
                    <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 12 }}>
                         <div
                              style={{
                                   width: 42,
                                   height: 42,
                                   borderRadius: 12,
                                   background: "linear-gradient(135deg, #f59e0b, #f97316)",
                                   display: "flex",
                                   alignItems: "center",
                                   justifyContent: "center",
                                   boxShadow: "0 4px 16px rgba(245, 158, 11, 0.3)",
                              }}
                         >
                              <Trophy size={22} color="#000" />
                         </div>
                         <div>
                              <span
                                   style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontWeight: 800,
                                        fontSize: 20,
                                        letterSpacing: "-0.5px",
                                        color: "#f1f5f9",
                                   }}
                              >
                                   IPL
                              </span>
                              <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 14, marginLeft: 6 }}>Predictor</span>
                         </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="desktop-nav">
                         {navLinks.map((link) => {
                              const isActive = pathname === link.href;
                              const Icon = link.icon;
                              return (
                                   <Link
                                        key={link.href}
                                        href={link.href}
                                        style={{
                                             textDecoration: "none",
                                             display: "flex",
                                             alignItems: "center",
                                             gap: 8,
                                             padding: "10px 20px",
                                             borderRadius: 10,
                                             fontSize: 14,
                                             fontWeight: 500,
                                             transition: "all 0.2s ease",
                                             background: isActive ? "rgba(245, 158, 11, 0.15)" : "transparent",
                                             color: isActive ? "#f59e0b" : "#94a3b8",
                                             border: isActive ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid transparent",
                                        }}
                                   >
                                        <Icon size={16} />
                                        {link.label}
                                   </Link>
                              );
                         })}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                         onClick={() => setIsOpen(!isOpen)}
                         style={{
                              display: "none",
                              background: "none",
                              border: "none",
                              color: "#f1f5f9",
                              cursor: "pointer",
                              padding: 8,
                         }}
                         className="mobile-toggle"
                    >
                         {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
               </div>

               {/* Mobile Menu */}
               {isOpen && (
                    <div
                         style={{
                              padding: "8px 24px 16px",
                              borderTop: "1px solid rgba(255,255,255,0.06)",
                         }}
                    >
                         {navLinks.map((link) => {
                              const isActive = pathname === link.href;
                              const Icon = link.icon;
                              return (
                                   <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        style={{
                                             textDecoration: "none",
                                             display: "flex",
                                             alignItems: "center",
                                             gap: 10,
                                             padding: "12px 16px",
                                             borderRadius: 10,
                                             fontSize: 15,
                                             fontWeight: 500,
                                             color: isActive ? "#f59e0b" : "#94a3b8",
                                             background: isActive ? "rgba(245, 158, 11, 0.1)" : "transparent",
                                             marginBottom: 4,
                                        }}
                                   >
                                        <Icon size={18} />
                                        {link.label}
                                   </Link>
                              );
                         })}
                    </div>
               )}

               <style jsx global>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
          </nav>
     );
}
