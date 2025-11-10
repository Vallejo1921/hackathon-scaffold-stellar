import React, { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useNavigate } from "react-router-dom";
import { BalloonFlyProvider, useBalloonFlyContext } from "../contexts/BalloonFlyContext";
import BetsSidebar from "../components/game/BetsSidebar";
import GameCanvas from "../components/game/GameCanvas";
import HistoryBar from "../components/game/HistoryBar";
import BettingControls from "../components/game/BettingControls";
import StatisticsPanel from "../components/game/StatisticsPanel";
import GameFooterCard from "../components/game/GameFooterCard";
import GameHeader from "../components/game/GameHeader";
import HamburgerMenu from "../components/game/HamburgerMenu";
import RoundDetailsModal from "../components/game/RoundDetailsModal";
import { Round } from "../contexts/BalloonFlyContext";

const GameContent: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const { pastRounds, fetchRoundDetails, formatXLM } = useBalloonFlyContext();

  // Converter histórico de rodadas para formato do HistoryBar
  const history = pastRounds
    .filter(round => round.status === "Ended" && round.crash_multiplier)
    .map(round => ({
      roundId: round.id,
      multiplier: Number(round.crash_multiplier) / 100,
      timestamp: round.ended_at || round.started_at || round.created_at
    }))
    .reverse(); // Mais recentes primeiro

  const handleRoundClick = async (roundId: bigint) => {
    try {
      const roundDetails = await fetchRoundDetails(roundId);
      setSelectedRound(roundDetails);
    } catch (error) {
      console.error("Error fetching round details:", error);
    }
  };

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 120px)",
        padding: "12px",
        background: "#0a0e1a",
        gap: "16px"
      }}>
        {/* Main Game Card */}
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
              <HistoryBar history={history} onRoundClick={handleRoundClick} />
              <GameCanvas />
              <BettingControls />
            </div>
          </div>
        </div>

        {/* Footer Card - Below main game card */}
        <div style={{
          width: "100%",
          maxWidth: "1400px"
        }}>
          <GameFooterCard />
        </div>

        {/* Statistics Card - Below footer card */}
        <div style={{
          width: "100%",
          maxWidth: "1400px",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)"
        }}>
          <StatisticsPanel 
            pastRounds={pastRounds}
            formatXLM={formatXLM}
          />
        </div>
      </div>

      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />

      {/* Round Details Modal */}
      <RoundDetailsModal
        round={selectedRound}
        onClose={() => {
          setSelectedRound(null);
        }}
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
