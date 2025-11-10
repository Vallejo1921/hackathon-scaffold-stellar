import React, { useState, useRef, useEffect, useCallback } from "react";

interface BettingPanelProps {
  isActive?: boolean;
  onBet?: (amount: number) => void;
  onCashOut?: () => void;
  loading?: boolean;
}

const BettingPanel: React.FC<BettingPanelProps> = React.memo(({
  isActive = false,
  onBet,
  onCashOut,
  loading = false
}) => {
  // Use refs to persist state across re-renders
  const stateRef = useRef({
    betAmount: 1.0,
    activeTab: "manual" as "manual" | "auto",
    autoBetEnabled: false,
    autoCashOutEnabled: false,
    autoCashOutMultiplier: 1.10
  });

  // Initialize betAmount - always start with 1.0
  const [betAmount, setBetAmountState] = useState(() => {
    let initialAmount = 1.0;
    const saved = localStorage.getItem("balloonfly_bet_amount");
    if (saved) {
      const amount = parseFloat(saved);
      if (!isNaN(amount) && amount >= 1.0) {
        initialAmount = amount;
      }
    }
    stateRef.current.betAmount = initialAmount;
    return initialAmount;
  });

  const [activeTab, setActiveTabState] = useState<"manual" | "auto">(() => {
    const saved = localStorage.getItem("balloonfly_bet_tab");
    if (saved && (saved === "manual" || saved === "auto")) {
      stateRef.current.activeTab = saved;
      return saved;
    }
    return "manual";
  });

  // Auto bet settings
  const [autoBetEnabled, setAutoBetEnabledState] = useState(() => {
    const saved = localStorage.getItem("balloonfly_auto_bet");
    return saved === "true";
  });

  const [autoCashOutEnabled, setAutoCashOutEnabledState] = useState(() => {
    const saved = localStorage.getItem("balloonfly_auto_cashout");
    return saved === "true";
  });

  const [autoCashOutMultiplier, setAutoCashOutMultiplierState] = useState(() => {
    const saved = localStorage.getItem("balloonfly_auto_cashout_mult");
    if (saved) {
      const mult = parseFloat(saved);
      if (!isNaN(mult) && mult >= 1.0) {
        return mult;
      }
    }
    return 1.10;
  });

  // Wrapper functions
  const setBetAmount = useCallback((amount: number | ((prev: number) => number)) => {
    const newAmount = typeof amount === 'function' ? amount(stateRef.current.betAmount) : amount;
    const clamped = Math.max(1.0, newAmount);
    stateRef.current.betAmount = clamped;
    setBetAmountState(clamped);
    localStorage.setItem("balloonfly_bet_amount", clamped.toString());
  }, []);

  const setActiveTab = useCallback((tab: "manual" | "auto") => {
    stateRef.current.activeTab = tab;
    setActiveTabState(tab);
    localStorage.setItem("balloonfly_bet_tab", tab);
  }, []);

  const setAutoBetEnabled = useCallback((enabled: boolean) => {
    stateRef.current.autoBetEnabled = enabled;
    setAutoBetEnabledState(enabled);
    localStorage.setItem("balloonfly_auto_bet", enabled.toString());
  }, []);

  const setAutoCashOutEnabled = useCallback((enabled: boolean) => {
    stateRef.current.autoCashOutEnabled = enabled;
    setAutoCashOutEnabledState(enabled);
    localStorage.setItem("balloonfly_auto_cashout", enabled.toString());
  }, []);

  const setAutoCashOutMultiplier = useCallback((mult: number) => {
    const clamped = Math.max(1.0, Math.min(1000.0, mult));
    stateRef.current.autoCashOutMultiplier = clamped;
    setAutoCashOutMultiplierState(clamped);
    localStorage.setItem("balloonfly_auto_cashout_mult", clamped.toString());
  }, []);

  // Sync ref with state
  useEffect(() => {
    stateRef.current.betAmount = betAmount;
    stateRef.current.activeTab = activeTab;
    stateRef.current.autoBetEnabled = autoBetEnabled;
    stateRef.current.autoCashOutEnabled = autoCashOutEnabled;
    stateRef.current.autoCashOutMultiplier = autoCashOutMultiplier;
  }, [betAmount, activeTab, autoBetEnabled, autoCashOutEnabled, autoCashOutMultiplier]);

  const quickAmounts = [10, 20, 50, 100];

  const handleIncrement = useCallback(() => {
    setBetAmount(prev => prev + 1.0);
  }, [setBetAmount]);

  const handleDecrement = useCallback(() => {
    setBetAmount(prev => Math.max(1.0, prev - 1.0));
  }, [setBetAmount]);

  const handleQuickAmount = useCallback((amount: number) => {
    setBetAmount(amount);
  }, [setBetAmount]);

  const handleAction = useCallback(() => {
    if (isActive && onCashOut) {
      onCashOut();
    } else if (onBet) {
      onBet(betAmount);
    }
  }, [isActive, onBet, onCashOut, betAmount]);

  // Calculate if buttons should be large (same size as main button)
  const isAutoMode = activeTab === "auto";
  const buttonPadding = isAutoMode ? "18px" : "10px";
  const buttonMinHeight = isAutoMode ? "60px" : "auto";

  return (
    <div style={{
      flex: 1,
      background: "#252837",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      minHeight: "0"
    }}>
      {/* Tabs */}
      <div style={{
        display: "flex",
        background: "#1e2130",
        padding: "4px",
        gap: "4px",
        borderRadius: "8px",
        marginBottom: "16px"
      }}>
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          style={{
            flex: 1,
            padding: "10px 16px",
            background: activeTab === "manual" ? "#252837" : "transparent",
            border: "none",
            color: activeTab === "manual" ? "#fff" : "#8b8fa3",
            cursor: "pointer",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            transition: "all 0.2s"
          }}
        >
          Aposta
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("auto")}
          style={{
            flex: 1,
            padding: "10px 16px",
            background: activeTab === "auto" ? "#252837" : "transparent",
            border: "none",
            color: activeTab === "auto" ? "#fff" : "#8b8fa3",
            cursor: "pointer",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: 500,
            transition: "all 0.2s"
          }}
        >
          Automático
        </button>
      </div>

      {/* Main Content - Side by Side Layout */}
      <div style={{
        display: "flex",
        gap: "16px",
        flex: 1,
        alignItems: "stretch"
      }}>
        {/* Left Section - Bet Amount and Controls */}
        <div style={{ 
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0
        }}>
          <div style={{
            color: "#8b8fa3",
            fontSize: "14px",
            fontWeight: 600,
            marginBottom: "8px"
          }}>
            Bet Amount (XLM)
          </div>

          {/* Spinner */}
          <div style={{
            background: "#1e2130",
            borderRadius: "8px",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
            border: "2px solid #3a3f5c"
          }}>
            <button
              type="button"
              onClick={handleDecrement}
              style={{
                width: "36px",
                height: "36px",
                background: "#3a3f5c",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: 600,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#8b5cf6";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#3a3f5c";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              −
            </button>
            <input
              type="text"
              value={betAmount.toFixed(2)}
              readOnly
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "20px",
                fontWeight: 700,
                flex: 1,
                textAlign: "center",
                outline: "none",
                minWidth: 0
              }}
            />
            <button
              type="button"
              onClick={handleIncrement}
              style={{
                width: "36px",
                height: "36px",
                background: "#3a3f5c",
                border: "none",
                borderRadius: "6px",
                color: "#fff",
                cursor: "pointer",
                fontSize: "20px",
                fontWeight: 600,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#8b5cf6";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#3a3f5c";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              +
            </button>
          </div>

          {/* Quick Amount Buttons - Show in BOTH modes, different sizes */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isAutoMode ? "1fr" : "1fr 1fr",
            gap: "8px",
            marginBottom: "12px"
          }}>
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => handleQuickAmount(amount)}
                style={{
                  padding: buttonPadding,
                  background: "#3a3f5c",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: buttonMinHeight
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#8b5cf6";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#3a3f5c";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {amount}
              </button>
            ))}
          </div>

          {/* Auto Settings - Always show at bottom */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "auto"
          }}>
            {/* Auto Bet Toggle */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              background: "#1e2130",
              borderRadius: "8px"
            }}>
              <span style={{
                color: "#fff",
                fontSize: "13px",
                fontWeight: 500
              }}>
                Aposta automática
              </span>
              <button
                type="button"
                onClick={() => setAutoBetEnabled(!autoBetEnabled)}
                style={{
                  width: "48px",
                  height: "24px",
                  background: autoBetEnabled ? "#10b981" : "#3a3f5c",
                  border: "none",
                  borderRadius: "12px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  padding: "2px",
                  flexShrink: 0
                }}
              >
                <div style={{
                  width: "20px",
                  height: "20px",
                  background: "#fff",
                  borderRadius: "50%",
                  transition: "transform 0.3s",
                  transform: autoBetEnabled ? "translateX(24px)" : "translateX(0)"
                }} />
              </button>
            </div>

            {/* Auto Cash Out Toggle */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "10px",
              background: "#1e2130",
              borderRadius: "8px"
            }}>
              <span style={{
                color: "#fff",
                fontSize: "13px",
                fontWeight: 500
              }}>
                Levantar Auto
              </span>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <input
                  type="number"
                  min="1.0"
                  max="1000.0"
                  step="0.01"
                  value={autoCashOutMultiplier.toFixed(2)}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 1.0) {
                      setAutoCashOutMultiplier(value);
                    }
                  }}
                  disabled={!autoCashOutEnabled}
                  style={{
                    width: "60px",
                    padding: "6px 8px",
                    background: autoCashOutEnabled ? "#1e2130" : "#2a2d3e",
                    border: "1px solid #3a3f5c",
                    borderRadius: "6px",
                    color: autoCashOutEnabled ? "#fff" : "#8b8fa3",
                    fontSize: "13px",
                    fontWeight: 600,
                    textAlign: "center",
                    outline: "none",
                    cursor: autoCashOutEnabled ? "text" : "not-allowed"
                  }}
                />
                <span style={{
                  color: "#8b8fa3",
                  fontSize: "13px",
                  fontWeight: 600
                }}>
                  X
                </span>
                <button
                  type="button"
                  onClick={() => setAutoCashOutEnabled(!autoCashOutEnabled)}
                  style={{
                    width: "48px",
                    height: "24px",
                    background: autoCashOutEnabled ? "#10b981" : "#3a3f5c",
                    border: "none",
                    borderRadius: "12px",
                    position: "relative",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    padding: "2px",
                    flexShrink: 0
                  }}
                >
                  <div style={{
                    width: "20px",
                    height: "20px",
                    background: "#fff",
                    borderRadius: "50%",
                    transition: "transform 0.3s",
                    transform: autoCashOutEnabled ? "translateX(24px)" : "translateX(0)"
                  }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Action Button */}
        <div style={{ 
          flex: 1,
          display: "flex",
          alignItems: "stretch",
          minWidth: 0
        }}>
          <button
            type="button"
            onClick={handleAction}
            disabled={loading}
            style={{
              width: "100%",
              padding: "18px",
              background: isActive 
                ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              animation: isActive ? "pulse 1s ease-in-out infinite" : "none",
              opacity: loading ? 0.6 : 1,
              alignSelf: "stretch"
            }}
            onMouseEnter={(e) => {
              if (!isActive && !loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(16, 185, 129, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            <span style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              {loading ? "Processing..." : isActive ? "💰 Cash Out Now!" : "Aposta"}
            </span>
            <span style={{
              fontSize: "18px",
              fontWeight: 700
            }}>
              {isActive ? "1.06 XLM" : `${betAmount.toFixed(2)} XLM`}
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent re-renders unless props actually changed
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.loading === nextProps.loading
  );
});

BettingPanel.displayName = "BettingPanel";

export default BettingPanel;
