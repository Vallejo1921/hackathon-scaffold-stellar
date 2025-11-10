use soroban_sdk::{contracttype, Address, BytesN, Vec};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum RoundStatus {
    Waiting,
    InProgress,
    Ended,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Round {
    pub id: u64,
    pub status: RoundStatus,
    pub server_seed_hash: BytesN<32>,
    pub crash_multiplier: u64, // 100 = 1.00x, 250 = 2.50x
    pub created_at: u64,
    pub started_at: u64,
    pub ended_at: u64,
    pub betting_window_end: u64, // Timestamp when betting window closes
    pub total_bet_amount: i128,
    pub total_payout: i128,
    pub bet_count: u32,
    pub client_seeds: Vec<BytesN<32>>, // First 3 client seeds for provably fair
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum BetStatus {
    Active,
    CashedOut,
    Lost,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Bet {
    pub id: u64,
    pub round_id: u64,
    pub player: Address,
    pub amount: i128,
    pub cash_out_multiplier: u64, // 0 if not cashed out
    pub payout: i128, // 0 if not cashed out
    pub status: BetStatus,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Pool {
    pub total_bets: i128,
    pub total_payouts: i128,
    pub total_house_earnings: i128,
}

