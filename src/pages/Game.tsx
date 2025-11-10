import React from "react";
import { useWallet } from "../hooks/useWallet";
import { useNavigate } from "react-router-dom";
import { BalloonFlyProvider } from "../contexts/BalloonFlyContext";
import BetsSidebar from "../components/game/BetsSidebar";
import GameCanvas from "../components/game/GameCanvas";
import HistoryBar from "../components/game/HistoryBar";
import BettingControls from "../components/game/BettingControls";

const GameContent: React.FC = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: "calc(100vh - 120px)",
      padding: "20px",
      background: "#0a0e1a"
    }}>
      <div style={{
        display: "flex",
        width: "100%",
        maxWidth: "1600px",
        height: "calc(100vh - 160px)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        background: "#0a0e1a"
      }}>
        <BetsSidebar />
        
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "#1a1d29"
        }}>
          <HistoryBar />
          <GameCanvas />
          <BettingControls />
        </div>
      </div>
    </div>
  );
};

const Game: React.FC = () => {
  const { address } = useWallet();
  const navigate = useNavigate();

  // Redirect to home if not connected
  React.useEffect(() => {
    if (!address) {
      navigate("/");
    }
  }, [address, navigate]);

  if (!address) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 120px)",
        background: "#0a0e1a",
        color: "#8b8fa3",
        fontSize: "18px"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎈</div>
          <div>Please connect your wallet to play</div>
        </div>
      </div>
    );
  }

  return (
    <BalloonFlyProvider>
      <GameContent />
    </BalloonFlyProvider>
  );
};

export default Game;
