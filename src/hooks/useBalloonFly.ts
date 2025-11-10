import { useState, useEffect, useCallback } from "react";
import { useWallet } from "./useWallet";
import balloonFlyClient from "../contracts/balloonfly";

// Types matching the Rust contract
export enum RoundStatus {
  Waiting = "Waiting",
  InProgress = "InProgress",
  Ended = "Ended",
}

export enum BetStatus {
  Active = "Active",
  CashedOut = "CashedOut",
  Lost = "Lost",
}

export interface Round {
  id: bigint;
  status: RoundStatus;
  server_seed_hash: Buffer;
  crash_multiplier: bigint;
  created_at: bigint;
  started_at: bigint;
  ended_at: bigint;
  betting_window_end: bigint; // Timestamp when betting window closes
  total_bet_amount: bigint;
  total_payout: bigint;
  bet_count: number;
  client_seeds: Buffer[];
}

export interface Bet {
  id: bigint;
  round_id: bigint;
  player: string;
  amount: bigint;
  cash_out_multiplier: bigint;
  payout: bigint;
  status: BetStatus;
  timestamp: bigint;
}

export interface Pool {
  total_bets: bigint;
  total_payouts: bigint;
  total_house_earnings: bigint;
}

interface UseBalloonFlyReturn {
  // State
  currentRound: Round | null;
  currentMultiplier: number;
  isFlying: boolean;
  userBet: Bet | null;
  pool: Pool | null;
  pastRounds: Round[];
  loading: boolean;
  error: string | null;

  // Actions
  placeBet: (amount: number) => Promise<void>;
  cashOut: () => Promise<void>;
  fetchRoundDetails: (roundId: bigint) => Promise<Round | null>;
  
  // Utilities
  formatXLM: (stroops: bigint) => string;
  multiplierToNumber: (mult: bigint) => number;
}

export const useBalloonFly = (): UseBalloonFlyReturn => {
  const { address } = useWallet();
  
  const [currentRound, setCurrentRound] = useState<Round | null>(null);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.0);
  const [isFlying, setIsFlying] = useState(false);
  const [userBet, setUserBet] = useState<Bet | null>(null);
  const [pool, setPool] = useState<Pool | null>(null);
  const [pastRounds, setPastRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Utility functions
  const formatXLM = useCallback((stroops: bigint): string => {
    return (Number(stroops) / 10_000_000).toFixed(2);
  }, []);

  const multiplierToNumber = useCallback((mult: bigint): number => {
    return Number(mult) / 100;
  }, []);

  // Fetch pool statistics
  const fetchPool = useCallback(async () => {
    try {
      const poolData = await balloonFlyClient.get_pool();
      if (poolData.result) {
        setPool(poolData.result as unknown as Pool);
      }
    } catch (err) {
      console.error("Error fetching pool:", err);
    }
  }, []);

  // Fetch current round using get_current_round
  const fetchCurrentRound = useCallback(async () => {
    try {
      const roundData = await balloonFlyClient.get_current_round();
      if (roundData.result) {
        const round = roundData.result as unknown as Round;
        setCurrentRound(round);
        
        // Update flying state based on round status
        if (round.status === RoundStatus.InProgress) {
          setIsFlying(true);
        } else {
          setIsFlying(false);
          
          // When round ends, add to history
          if (round.status === RoundStatus.Ended) {
            setPastRounds(prev => {
              // Check if round already exists
              const exists = prev.some(r => r.id === round.id);
              if (exists) return prev;
              // Add to beginning and keep last 100 rounds
              return [round, ...prev].slice(0, 100);
            });
          }
        }
      }
    } catch (err) {
      console.error("Error fetching current round:", err);
      // If no active round, set to null
      setCurrentRound(null);
    }
  }, []);

  // Fetch round details (for modal)
  const fetchRoundDetails = useCallback(async (roundId: bigint): Promise<Round | null> => {
    try {
      const roundData = await balloonFlyClient.get_round({ round_id: roundId });
      if (roundData.result) {
        return roundData.result as unknown as Round;
      }
      return null;
    } catch (err) {
      console.error("Error fetching round details:", err);
      return null;
    }
  }, []);

  // Place bet
  const placeBet = useCallback(async (amount: number) => {
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    if (!currentRound) {
      setError("No active round");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const amountInStroops = BigInt(Math.floor(amount * 10_000_000));
      
      // Generate random client seed
      const clientSeed = new Uint8Array(32);
      crypto.getRandomValues(clientSeed);
      
      const result = await balloonFlyClient.place_bet({
        player: address,
        round_id: currentRound.id,
        amount: amountInStroops,
        client_seed: Buffer.from(clientSeed),
      });

      console.log("Bet placed:", result);
      
      // Fetch the bet details
      if (result.result) {
        const betId = result.result as unknown as bigint;
        const betData = await balloonFlyClient.get_bet({ bet_id: betId });
        if (betData.result) {
          setUserBet(betData.result as unknown as Bet);
        }
      }

      // Refresh round data
      await fetchCurrentRound();
    } catch (err: any) {
      console.error("Error placing bet:", err);
      setError(err.message || "Failed to place bet");
    } finally {
      setLoading(false);
    }
  }, [address, currentRound, fetchCurrentRound]);

  // Cash out
  const cashOut = useCallback(async () => {
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    if (!userBet || userBet.status !== BetStatus.Active) {
      setError("No active bet to cash out");
      return;
    }

    if (!isFlying) {
      setError("Round is not in progress");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const currentMultiplierInContract = BigInt(Math.floor(currentMultiplier * 100));
      
      const result = await balloonFlyClient.cash_out({
        player: address,
        bet_id: userBet.id,
        current_multiplier: currentMultiplierInContract,
      });

      console.log("Cashed out:", result);
      
      // Refresh bet data
      const betData = await balloonFlyClient.get_bet({ bet_id: userBet.id });
      if (betData.result) {
        setUserBet(betData.result as unknown as Bet);
      }

      // Refresh round data
      await fetchCurrentRound();
    } catch (err: any) {
      console.error("Error cashing out:", err);
      setError(err.message || "Failed to cash out");
    } finally {
      setLoading(false);
    }
  }, [address, userBet, isFlying, currentMultiplier, currentRound, fetchCurrentRound]);

  // Calculate multiplier based on elapsed time since round started
  // Formula: multiplier = 1 + (time_elapsed^1.55 * 1.6) / 100
  useEffect(() => {
    if (!isFlying || !currentRound || currentRound.started_at === 0n) {
      setCurrentMultiplier(1.0);
      return;
    }

    const interval = setInterval(() => {
      const now = BigInt(Math.floor(Date.now() / 1000));
      const startedAt = currentRound.started_at;
      const elapsedSeconds = Number(now - startedAt);
      
      if (elapsedSeconds < 0) {
        setCurrentMultiplier(1.0);
        return;
      }
      
      // Calculate multiplier: 1 + (t^1.55 * 1.6) / 100
      const multiplier = 1.0 + (Math.pow(elapsedSeconds, 1.55) * 1.6) / 100;
      
      // Check if crashed
      if (currentRound.crash_multiplier > 0) {
        const crashMult = multiplierToNumber(currentRound.crash_multiplier);
        if (multiplier >= crashMult) {
          setIsFlying(false);
          setCurrentMultiplier(crashMult);
          return;
        }
      }
      
      setCurrentMultiplier(multiplier);
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [isFlying, currentRound, multiplierToNumber]);

  // Fetch current round on mount and poll for updates
  useEffect(() => {
    fetchCurrentRound();
    
    // Poll for round updates every 2 seconds
    const interval = setInterval(fetchCurrentRound, 2000);
    return () => clearInterval(interval);
  }, [fetchCurrentRound]);

  // Fetch pool on mount
  useEffect(() => {
    fetchPool();
    
    // Refresh pool every 10 seconds
    const interval = setInterval(fetchPool, 10000);
    return () => clearInterval(interval);
  }, [fetchPool]);

  return {
    currentRound,
    currentMultiplier,
    isFlying,
    userBet,
    pool,
    pastRounds,
    loading,
    error,
    placeBet,
    cashOut,
    fetchRoundDetails,
    formatXLM,
    multiplierToNumber,
  };
};

