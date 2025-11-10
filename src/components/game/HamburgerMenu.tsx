import React, { useState } from "react";
import { useWallet } from "../../hooks/useWallet";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { address } = useWallet();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  if (!isOpen) return null;

  const menuItems = [
    { icon: "⭐", label: "Free Bets", onClick: () => {} },
    { icon: "🕐", label: "My Bet History", onClick: () => {} },
    { icon: "📷", label: "Game Limits", onClick: () => {} },
    { icon: "❓", label: "How to Play", onClick: () => {} },
    { icon: "📄", label: "Game Rules", onClick: () => {} },
    { icon: "🛡️", label: "Provably Fair Settings", onClick: () => {} },
    { icon: "🏠", label: "Home", onClick: () => {} },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 1100,
          backdropFilter: "blur(4px)"
        }}
      />

      {/* Menu Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "320px",
          height: "100vh",
          background: "#1e2130",
          borderLeft: "1px solid #2a2d3e",
          zIndex: 1101,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.5)",
          animation: "slideIn 0.3s ease-out"
        }}
      >
        {/* Header */}
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #2a2d3e",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            color: "#fff"
          }}>
            Settings
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#8b8fa3",
              cursor: "pointer",
              fontSize: "24px",
              padding: "0",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
              e.currentTarget.style.color = "#EF4444";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#8b8fa3";
            }}
          >
            ×
          </button>
        </div>

        {/* User Profile */}
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #2a2d3e",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}>
              🎈
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#fff",
                marginBottom: "4px"
              }}>
                {address ? `${address.slice(0, 6)}...${address.slice(-6)}` : "Not Connected"}
              </div>
              <button
                style={{
                  background: "transparent",
                  border: "1px solid #2a2d3e",
                  borderRadius: "6px",
                  padding: "6px 12px",
                  color: "#8b8fa3",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#8b5cf6";
                  e.currentTarget.style.color = "#8b5cf6";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2a2d3e";
                  e.currentTarget.style.color = "#8b8fa3";
                }}
              >
                👤 Change Avatar
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Settings */}
        <div style={{
          padding: "20px",
          borderBottom: "1px solid #2a2d3e",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          {/* Sound Toggle */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>🔊</span>
              <span style={{ color: "#fff", fontSize: "14px" }}>Sound</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              style={{
                width: "48px",
                height: "24px",
                borderRadius: "12px",
                background: soundEnabled ? "#10b981" : "#2a2d3e",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.3s"
              }}
            >
              <div style={{
                position: "absolute",
                top: "2px",
                left: soundEnabled ? "26px" : "2px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#fff",
                transition: "all 0.3s"
              }} />
            </button>
          </div>

          {/* Music Toggle */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>🎵</span>
              <span style={{ color: "#fff", fontSize: "14px" }}>Music</span>
            </div>
            <button
              onClick={() => setMusicEnabled(!musicEnabled)}
              style={{
                width: "48px",
                height: "24px",
                borderRadius: "12px",
                background: musicEnabled ? "#10b981" : "#2a2d3e",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.3s"
              }}
            >
              <div style={{
                position: "absolute",
                top: "2px",
                left: musicEnabled ? "26px" : "2px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#fff",
                transition: "all 0.3s"
              }} />
            </button>
          </div>

          {/* Animation Toggle */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>🌀</span>
              <span style={{ color: "#fff", fontSize: "14px" }}>Animation</span>
            </div>
            <button
              onClick={() => setAnimationEnabled(!animationEnabled)}
              style={{
                width: "48px",
                height: "24px",
                borderRadius: "12px",
                background: animationEnabled ? "#10b981" : "#2a2d3e",
                border: "none",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.3s"
              }}
            >
              <div style={{
                position: "absolute",
                top: "2px",
                left: animationEnabled ? "26px" : "2px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#fff",
                transition: "all 0.3s"
              }} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 0"
        }}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              style={{
                width: "100%",
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                color: "#8b8fa3",
                fontSize: "14px",
                textAlign: "left",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)";
                e.currentTarget.style.color = "#8b5cf6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#8b8fa3";
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "16px 20px",
          borderTop: "1px solid #2a2d3e",
          fontSize: "11px",
          color: "#8b8fa3",
          textAlign: "center"
        }}>
          🔒 Provably Fair Game
          <br />
          Powered by Stellar
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default HamburgerMenu;

