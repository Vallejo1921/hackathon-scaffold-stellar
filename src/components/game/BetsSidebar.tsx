import React, { useState } from "react";
import { useBalloonFlyContext } from "../../contexts/BalloonFlyContext";

const BetsSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"bets" | "previous" | "top">("bets");
  const { pool, formatXLM, currentRound, userBet, pastRounds, multiplierToNumber } = useBalloonFlyContext();

  // Get rounds data for Previous/Top tabs
  const getRoundsData = () => {
    if (activeTab === "previous") {
      // Previous rounds - show last 10 ended rounds
      return pastRounds
        .filter(r => r.status === "Ended")
        .slice(0, 10);
    } else if (activeTab === "top") {
      // Top rounds - show rounds with highest payouts
      return pastRounds
        .filter(r => r.status === "Ended" && r.total_payout > 0n)
        .sort((a, b) => {
          const payoutA = Number(a.total_payout);
          const payoutB = Number(b.total_payout);
          return payoutB - payoutA;
        })
        .slice(0, 10);
    }
    return [];
  };

  const roundsData = getRoundsData();

  const getMultiplierColor = (mult: number | null) => {
    if (!mult) return "";
    if (mult < 2.0) return "#3B82F6";
    if (mult < 10.0) return "#A855F7";
    return "#EF4444";
  };

  return (
    <div style={{
      width: "340px",
      background: "#1e2130",
      borderRight: "1px solid #2a2d3e",
      display: "flex",
      flexDirection: "column"
    }}>
      {/* Navigation Tabs */}
      <div style={{
        display: "flex",
        background: "#252837",
        padding: "8px",
        gap: "4px"
      }}>
        {(["bets", "previous", "top"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px 16px",
              background: activeTab === tab ? "#1e2130" : "transparent",
              border: "none",
              color: activeTab === tab ? "#fff" : "#8b8fa3",
              cursor: "pointer",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.2s"
            }}
          >
            {tab === "bets" ? "Bets" : tab === "previous" ? "Previous" : "Top"}
          </button>
        ))}
      </div>

      {/* Total Win Widget */}
      <div style={{
        background: "linear-gradient(135deg, #2d1b4e 0%, #1e1535 100%)",
        padding: "16px",
        margin: "12px",
        borderRadius: "12px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <div style={{ display: "flex", gap: "4px" }}>
            {["🎈", "🎯", "⭐"].map((emoji, i) => (
              <div key={i} style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "2px solid #1e2130",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                marginLeft: i > 0 ? "-10px" : "0"
              }}>
                {emoji}
              </div>
            ))}
          </div>
          <span style={{ fontSize: "24px", fontWeight: 700, color: "#fff" }}>
            {pool ? formatXLM(pool.total_payouts) : "0.00"}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#8b8fa3" }}>
          <span><strong style={{ color: "#fff" }}>{currentRound?.bet_count || 0}</strong> Bets</span>
          <span>Total Prize XLM</span>
        </div>
        <div style={{
          height: "4px",
          background: "rgba(255, 255, 255, 0.1)",
          borderRadius: "2px",
          marginTop: "12px",
          overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)",
            width: "60.9%",
            borderRadius: "2px",
            transition: "width 0.3s"
          }} />
        </div>
      </div>

      {/* List Header - Dynamic based on tab */}
      <div style={{
        display: "grid",
        gridTemplateColumns: activeTab === "bets" ? "2fr 1fr 1fr 1fr" : "1fr 1fr 1fr 1fr",
        padding: "12px 16px",
        background: "#252837",
        fontSize: "11px",
        color: "#8b8fa3",
        textTransform: "uppercase",
        fontWeight: 600
      }}>
        {activeTab === "bets" ? (
          <>
            <span>Player</span>
            <span>Bet</span>
            <span>X</span>
            <span>Prize</span>
          </>
        ) : (
          <>
            <span>Round</span>
            <span>Bets</span>
            <span>Multiplier</span>
            <span>Payout</span>
          </>
        )}
      </div>

      {/* List Content */}
      <div style={{
        flex: 1,
        overflowY: "auto"
      }}>
        {activeTab === "bets" ? (
          // Bets tab - show user's bet
          !userBet ? (
            <div style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#8b8fa3"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎈</div>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px", color: "#fff" }}>
                No bets yet
              </div>
              <div style={{ fontSize: "12px" }}>
                Be the first to place a bet!
              </div>
            </div>
          ) : (
            (() => {
              const bet = userBet;
              const multiplier = bet.cash_out_multiplier > 0n 
                ? Number(bet.cash_out_multiplier) / 100 
                : null;
              const payout = bet.payout > 0n 
                ? Number(bet.payout) / 10_000_000 
                : null;
              const playerAddress = bet.player;
              const shortAddress = playerAddress.length > 12 
                ? `${playerAddress.slice(0, 6)}...${playerAddress.slice(-6)}`
                : playerAddress;
              
              // Generate avatar emoji from address
              const avatars = ["🎈", "🎯", "⭐", "💎", "🚀", "🌟", "🎲", "🏆"];
              const avatarIndex = parseInt(playerAddress.slice(-2) || "0", 16) % avatars.length;
              const avatar = avatars[avatarIndex];

              return (
                <div
                  key={bet.id.toString()}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr 1fr",
                    padding: "12px 16px",
                    borderBottom: "1px solid #252837",
                    alignItems: "center",
                    background: payout ? "rgba(124, 58, 237, 0.05)" : "transparent",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px"
                    }}>
                      {avatar}
                    </div>
                    <span style={{ fontSize: "11px", color: "#fff", fontFamily: "'Courier New', monospace" }}>
                      {shortAddress}
                    </span>
                  </div>
                  <span style={{ fontSize: "13px", color: "#8b8fa3" }}>
                    {formatXLM(bet.amount)}
                  </span>
                  <span style={{ 
                    fontSize: "13px", 
                    color: multiplier ? getMultiplierColor(multiplier) : "#8b8fa3", 
                    fontWeight: multiplier ? 600 : 400 
                  }}>
                    {multiplier ? `${multiplier.toFixed(2)}x` : ""}
                  </span>
                  <span style={{ 
                    fontSize: "13px", 
                    color: payout ? "#10b981" : "#8b8fa3", 
                    fontWeight: payout ? 600 : 400 
                  }}>
                    {payout ? `${payout.toFixed(2)}` : ""}
                  </span>
                </div>
              );
            })()
          )
        ) : (
          // Previous/Top tabs - show rounds
          roundsData.length === 0 ? (
            <div style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#8b8fa3"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>📊</div>
              <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px", color: "#fff" }}>
                No {activeTab === "previous" ? "previous" : "top"} rounds yet
              </div>
              <div style={{ fontSize: "12px" }}>
                {activeTab === "previous" 
                  ? "Rounds will appear here after they end"
                  : "Top rounds will appear here based on payouts"}
              </div>
            </div>
          ) : (
            roundsData.map((round) => {
              const crashMult = round.crash_multiplier > 0n 
                ? multiplierToNumber(round.crash_multiplier) 
                : null;
              const payout = round.total_payout > 0n 
                ? Number(round.total_payout) / 10_000_000 
                : 0;

              return (
                <div
                  key={round.id.toString()}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    padding: "12px 16px",
                    borderBottom: "1px solid #252837",
                    alignItems: "center",
                    background: payout > 0 ? "rgba(124, 58, 237, 0.05)" : "transparent",
                    transition: "background 0.2s"
                  }}
                >
                  <span style={{ fontSize: "13px", color: "#fff", fontWeight: 600 }}>
                    #{round.id.toString()}
                  </span>
                  <span style={{ fontSize: "13px", color: "#8b8fa3" }}>
                    {round.bet_count}
                  </span>
                  <span style={{ 
                    fontSize: "13px", 
                    color: crashMult ? getMultiplierColor(crashMult) : "#8b8fa3", 
                    fontWeight: crashMult ? 600 : 400 
                  }}>
                    {crashMult ? `${crashMult.toFixed(2)}x` : "—"}
                  </span>
                  <span style={{ 
                    fontSize: "13px", 
                    color: payout > 0 ? "#10b981" : "#8b8fa3", 
                    fontWeight: payout > 0 ? 600 : 400 
                  }}>
                    {payout > 0 ? formatXLM(round.total_payout) : "—"}
                  </span>
                </div>
              );
            })
          )
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: "12px 16px",
        background: "#252837",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid #2a2d3e"
      }}>
        <button style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 12px",
          background: "transparent",
          border: "1px solid #3a3f5c",
          borderRadius: "6px",
          color: "#8b8fa3",
          fontSize: "11px",
          cursor: "pointer",
          transition: "all 0.2s"
        }}>
          🔒 Provably Fair Game
        </button>
        <span style={{ color: "#8b8fa3", fontSize: "11px" }}>Powered by Stellar</span>
      </div>
    </div>
  );
};

export default BetsSidebar;

