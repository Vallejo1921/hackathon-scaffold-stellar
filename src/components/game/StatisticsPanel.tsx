import React, { useState, useMemo } from "react";
import { Round } from "../../contexts/BalloonFlyContext";
import { RoundStatus } from "../../hooks/useBalloonFly";

interface StatisticsPanelProps {
  pastRounds: Round[];
  formatXLM: (stroops: bigint) => string;
}

type TimeFilter = "today" | "7d" | "15d" | "30d";

interface Statistics {
  paid: bigint;
  rtp: number;
  players: number;
  onlineNow: number;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  pastRounds,
  formatXLM,
}) => {
  const [filter, setFilter] = useState<TimeFilter>("today");

  // Calculate statistics based on filter
  const statistics = useMemo((): Statistics => {
    const now = Date.now();
    const filterMs: Record<TimeFilter, number> = {
      today: 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "15d": 15 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };

    const filteredRounds = pastRounds.filter((round) => {
      if (round.status !== RoundStatus.Ended) return false;
      const roundTime =
        Number(round.ended_at || round.started_at || round.created_at) * 1000;
      return now - roundTime <= filterMs[filter];
    });

    // Calcular valores
    const paid = filteredRounds.reduce((sum, r) => sum + r.total_payout, 0n);
    const totalBets = filteredRounds.reduce(
      (sum, r) => sum + r.total_bet_amount,
      0n,
    );
    const rtp = totalBets > 0n ? (Number(paid) / Number(totalBets)) * 100 : 0;

    // Unique players (estimate based on rounds)
    // In production, this would come from a real query
    const players =
      filteredRounds.length > 0
        ? Math.max(
            filteredRounds.length * 5,
            filteredRounds.reduce((sum, r) => sum + r.bet_count, 0),
          )
        : 0;

    // Online now - calculated based on active and recent rounds
    // TODO: Implement real online player tracking via events or backend
    const onlineNow = 0; // For now, 0 until we implement real tracking

    return {
      paid,
      rtp,
      players,
      onlineNow,
    };
  }, [pastRounds, filter]);

  const filterButtons: { key: TimeFilter; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "7d", label: "7D" },
    { key: "15d", label: "15D" },
    { key: "30d", label: "30D" },
  ];

  return (
    <div
      style={{
        padding: "20px",
        background: "#1e2130",
        borderTop: "1px solid #2a2d3e",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            color: "#fff",
          }}
        >
          Statistics
        </h3>

        {/* Filter Buttons */}
        <div
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          {filterButtons.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "6px 12px",
                background:
                  filter === key ? "rgba(139, 92, 246, 0.2)" : "transparent",
                border: `1px solid ${filter === key ? "#8b5cf6" : "#2a2d3e"}`,
                borderRadius: "6px",
                color: filter === key ? "#8b5cf6" : "#8b8fa3",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (filter !== key) {
                  e.currentTarget.style.borderColor = "#8b5cf6";
                  e.currentTarget.style.color = "#8b5cf6";
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== key) {
                  e.currentTarget.style.borderColor = "#2a2d3e";
                  e.currentTarget.style.color = "#8b8fa3";
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Cards - Single Row */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          overflowX: "auto",
        }}
      >
        {/* Paid Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #2d1b4e 0%, #1e1535 100%)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #2a2d3e",
            flex: "1",
            minWidth: "200px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(59, 130, 246, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              💰
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#8b8fa3",
                fontWeight: 600,
              }}
            >
              Paid
            </span>
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {formatXLM(statistics.paid)} XLM
          </div>
        </div>

        {/* RTP Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #2d1b4e 0%, #1e1535 100%)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #2a2d3e",
            flex: "1",
            minWidth: "200px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              📈
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#8b8fa3",
                fontWeight: 600,
              }}
            >
              RTP
            </span>
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: statistics.rtp >= 100 ? "#10b981" : "#EF4444",
            }}
          >
            {statistics.rtp.toFixed(2)}%
          </div>
        </div>

        {/* Players Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #2d1b4e 0%, #1e1535 100%)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #2a2d3e",
            flex: "1",
            minWidth: "200px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(168, 85, 247, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}
            >
              👥
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#8b8fa3",
                fontWeight: 600,
              }}
            >
              Players
            </span>
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {statistics.players.toLocaleString()}
          </div>
        </div>

        {/* Online Now Card */}
        <div
          style={{
            background: "linear-gradient(135deg, #2d1b4e 0%, #1e1535 100%)",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #2a2d3e",
            flex: "1",
            minWidth: "200px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "rgba(16, 185, 129, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                position: "relative",
              }}
            >
              <span>👥</span>
              <div
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "#10b981",
                  border: "2px solid #1e2130",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "#8b8fa3",
                fontWeight: 600,
              }}
            >
              Online Now
            </span>
          </div>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#10b981",
            }}
          >
            {statistics.onlineNow.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
