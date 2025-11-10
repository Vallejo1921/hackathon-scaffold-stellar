import React, { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useNavigate } from "react-router-dom";
import { BalloonFlyProvider } from "../contexts/BalloonFlyContext";
import BetsSidebar from "../components/game/BetsSidebar";
import GameCanvas from "../components/game/GameCanvas";
import HistoryBar from "../components/game/HistoryBar";
import BettingControls from "../components/game/BettingControls";
import GameHeader from "../components/game/GameHeader";
import HamburgerMenu from "../components/game/HamburgerMenu";

const GameContent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "calc(100vh - 120px)",
        padding: "12px",
        background: "#0a0e1a"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "1400px",
          height: "calc(100vh - 144px)",
          maxHeight: "calc(100vh - 144px)",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          background: "#0a0e1a"
        }}>
          {/* Game Header */}
          <GameHeader onMenuClick={() => setIsMenuOpen(true)} />
          
          <div style={{
            display: "flex",
            flex: 1,
            overflow: "hidden"
          }}>
            <BetsSidebar />
            
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "#1a1d29",
              overflow: "hidden"
            }}>
              <HistoryBar />
              <GameCanvas />
              <BettingControls />
            </div>
          </div>
        </div>
      </div>

      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </>
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
