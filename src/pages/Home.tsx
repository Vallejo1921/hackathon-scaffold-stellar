import React, { useEffect } from "react";
import { Layout } from "@stellar/design-system";
import { NavLink, useNavigate } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";

const Home: React.FC = () => {
  const { address } = useWallet();
  const navigate = useNavigate();

  // Redireciona para /game/balloonfly quando conectar wallet
  useEffect(() => {
    if (address) {
      navigate("/game/balloonfly");
    }
  }, [address, navigate]);

  return (
    <Layout.Content>
      <Layout.Inset>
        {/* Hero Section */}
        <div style={{ 
          textAlign: "center", 
          padding: "80px 20px 60px",
          maxWidth: "900px",
          margin: "0 auto"
        }}>
          <div style={{ 
            fontSize: "100px", 
            marginBottom: "24px",
            animation: "float 3s ease-in-out infinite"
          }}>
            🎈
          </div>
          
          <h1 style={{
            fontSize: "72px",
            fontWeight: "900",
            background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "24px",
            lineHeight: "1.1",
            letterSpacing: "-0.02em"
          }}>
            BalloonFly
          </h1>

          <p style={{ 
            color: "#94a3b8", 
            fontSize: "20px",
            lineHeight: "1.6",
            maxWidth: "600px",
            margin: "0 auto 48px",
            fontWeight: "400"
          }}>
            A provably fair crash game on Stellar. Watch the multiplier soar, 
            place your bets, and cash out before the balloon pops.
          </p>

              <NavLink to="/game/balloonfly" style={{ textDecoration: "none" }}>
            <button style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
              border: "none",
              borderRadius: "16px",
              padding: "18px 48px",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 40px rgba(139, 92, 246, 0.4)",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 15px 50px rgba(139, 92, 246, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 40px rgba(139, 92, 246, 0.4)";
            }}
            >
              🎮 Play Now
            </button>
          </NavLink>
        </div>

        {/* How to Play Section */}
        <div style={{ 
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <h2 style={{ 
            color: "#fff", 
            fontSize: "36px",
            fontWeight: "800",
            textAlign: "center",
            marginBottom: "48px",
            letterSpacing: "-0.01em"
          }}>
            How to Play
          </h2>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "32px"
          }}>
            {[
              { icon: "🔗", title: "Connect Wallet", desc: "Link your Stellar wallet to get started" },
              { icon: "💰", title: "Place Your Bet", desc: "Choose your wager before the round starts" },
              { icon: "📈", title: "Watch It Rise", desc: "The multiplier grows as the balloon flies higher" },
              { icon: "💸", title: "Cash Out", desc: "Exit before the crash to secure your winnings" }
            ].map((step, idx) => (
              <div key={idx} style={{ 
                background: "linear-gradient(135deg, rgba(30, 33, 48, 0.6) 0%, rgba(30, 33, 48, 0.3) 100%)",
                borderRadius: "20px",
                padding: "32px 24px",
                border: "1px solid rgba(139, 92, 246, 0.1)",
                transition: "all 0.3s ease",
                cursor: "default"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.3)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <div style={{ 
                  fontSize: "48px", 
                  marginBottom: "16px",
                  filter: "grayscale(0)"
                }}>
                  {step.icon}
                </div>
                <h3 style={{ 
                  color: "#fff", 
                  fontSize: "20px",
                  fontWeight: "700",
                  marginBottom: "12px"
                }}>
                  {step.title}
                </h3>
                <p style={{ 
                  color: "#94a3b8", 
                  fontSize: "15px",
                  lineHeight: "1.6",
                  margin: 0
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div style={{ 
          padding: "60px 20px",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "32px"
          }}>
            {/* Provably Fair Card */}
            <div style={{ 
              padding: "40px",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)",
              borderRadius: "24px",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>🔒</div>
              <h3 style={{ 
                color: "#8b5cf6", 
                fontSize: "24px",
                fontWeight: "700", 
                marginBottom: "16px"
              }}>
                Provably Fair
              </h3>
              <p style={{ 
                color: "#94a3b8", 
                fontSize: "15px",
                lineHeight: "1.6",
                margin: 0
              }}>
                Every round is cryptographically verifiable using server and client seeds. 
                Complete transparency guaranteed on-chain.
              </p>
            </div>

            {/* Built with Scaffold Card */}
            <div style={{ 
              padding: "40px",
              background: "linear-gradient(135deg, rgba(30, 33, 48, 0.6) 0%, rgba(30, 33, 48, 0.3) 100%)",
              borderRadius: "24px",
              border: "1px solid rgba(139, 92, 246, 0.2)"
            }}>
              <div style={{ fontSize: "40px", marginBottom: "20px" }}>⚡</div>
              <h3 style={{ 
                color: "#fff", 
                fontSize: "24px",
                fontWeight: "700", 
                marginBottom: "20px"
              }}>
                Built with Scaffold Stellar
              </h3>
              <ul style={{ 
                listStyle: "none", 
                padding: 0,
                margin: 0,
                color: "#94a3b8",
                fontSize: "15px",
                lineHeight: "2"
              }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#10b981" }}>✓</span> Rust smart contracts
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#10b981" }}>✓</span> Auto-generated TypeScript bindings
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#10b981" }}>✓</span> Stellar Wallet Kit integration
                </li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#10b981" }}>✓</span> Modern React + Vite stack
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          maxWidth: "700px",
          margin: "0 auto"
        }}>
          <h2 style={{
            color: "#fff",
            fontSize: "42px",
            fontWeight: "800",
            marginBottom: "24px",
            lineHeight: "1.2"
          }}>
            Ready to Fly?
          </h2>
          <p style={{
            color: "#94a3b8",
            fontSize: "18px",
            marginBottom: "40px",
            lineHeight: "1.6"
          }}>
            Connect your wallet and experience the thrill of BalloonFly
          </p>
              <NavLink to="/game/balloonfly" style={{ textDecoration: "none" }}>
            <button style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              borderRadius: "16px",
              padding: "18px 48px",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 10px 40px rgba(16, 185, 129, 0.3)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 15px 50px rgba(16, 185, 129, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 10px 40px rgba(16, 185, 129, 0.3)";
            }}
            >
              Launch Game 🚀
            </button>
          </NavLink>
        </div>

        {/* Animation Keyframes */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `}
        </style>
      </Layout.Inset>
    </Layout.Content>
  );
};

export default Home;
