use soroban_sdk::{symbol_short, Address, Env, Symbol};

use crate::{error::Error, types::{Bet, Pool, Round}};

// Storage keys
pub const ADMIN: Symbol = symbol_short!("ADMIN");
pub const POOL: Symbol = symbol_short!("POOL");
pub const CURRENT_ROUND_ID: Symbol = symbol_short!("CURR_RND");

// Constants
pub const HOUSE_EDGE_BPS: u32 = 300; // 3% = 300 basis points

/// Check if admin is initialized
pub fn has_admin(env: &Env) -> bool {
    env.storage().instance().has(&ADMIN)
}

/// Get admin address
pub fn get_admin(env: &Env) -> Address {
    env.storage()
        .instance()
        .get(&ADMIN)
        .expect("Admin not initialized")
}

/// Set admin address
pub fn set_admin(env: &Env, admin: &Address) {
    env.storage().instance().set(&ADMIN, admin);
}

/// Get round by ID
pub fn get_round(env: &Env, round_id: u64) -> Result<Round, Error> {
    env.storage()
        .persistent()
        .get(&round_id)
        .ok_or(Error::RoundNotFound)
}

/// Set round
pub fn set_round(env: &Env, round_id: u64, round: &Round) {
    env.storage().persistent().set(&round_id, round);
}

/// Get bet by ID
pub fn get_bet(env: &Env, bet_id: u64) -> Result<Bet, Error> {
    env.storage()
        .persistent()
        .get(&bet_id)
        .ok_or(Error::BetNotFound)
}

/// Set bet
pub fn set_bet(env: &Env, bet_id: u64, bet: &Bet) {
    env.storage().persistent().set(&bet_id, bet);
}

/// Get pool statistics
pub fn get_pool(env: &Env) -> Pool {
    env.storage()
        .instance()
        .get(&POOL)
        .unwrap_or(Pool {
            total_bets: 0,
            total_payouts: 0,
            total_house_earnings: 0,
        })
}

/// Set pool statistics
pub fn set_pool(env: &Env, pool: &Pool) {
    env.storage().instance().set(&POOL, pool);
}

/// Get current round ID
pub fn get_current_round_id(env: &Env) -> Option<u64> {
    env.storage().instance().get(&CURRENT_ROUND_ID)
}

/// Set current round ID
pub fn set_current_round_id(env: &Env, round_id: u64) {
    env.storage().instance().set(&CURRENT_ROUND_ID, &round_id);
}

