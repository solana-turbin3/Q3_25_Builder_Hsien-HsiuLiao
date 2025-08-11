use anchor_lang::prelude::*;

#[account] 
#[derive(InitSpace)]
pub struct Config {
    pub seed: u64, 
    pub authority: Option<Pubkey>, //optional, for lp, sometimes you want to lock, but not after maturity
    pub mint_x: Pubkey, //for lp
    pub mint_y: Pubkey, //for lp
    pub fee: u16,
    pub locked: bool, 

    pub config_bump: u8,
    pub lp_bump: u8

}

/*
Looking at the `Config` struct for the AMM program, here's why each field is needed:

- **`seed: u64`** - Unique identifier for the AMM instance. Used in PDA derivation to create deterministic addresses for the config and LP accounts. Allows multiple AMM pools to exist.

- **`authority: Option<Pubkey>`** - Optional admin key that can control the pool. Used for:
  - Emergency stops/updates
  - Fee adjustments
  - Pool locking/unlocking
  - The `Option` wrapper allows for permissionless pools (when `None`)

- **`mint_x: Pubkey`** - First token mint address in the trading pair. Essential for:
  - Identifying what tokens can be swapped
  - Managing liquidity balances
  - Token transfers

- **`mint_y: Pubkey`** - Second token mint address in the trading pair. Same purpose as `mint_x` - defines the trading pair.

- **`fee: u16`** - Trading fee in basis points (e.g., 30 = 0.3%). Required for:
  - Calculating swap fees
  - LP reward distribution
  - Protocol revenue

- **`locked: bool`** - Pool state flag. Used for:
  - Emergency stops
  - Maintenance periods
  - Preventing trades during critical operations

- **`config_bump: u8`** - Bump seed for the config PDA. Required for:
  - Avoiding address collisions
  - Program signing for the config account

- **`lp_bump: u8`** - Bump seed for the LP token mint PDA. Required for:
  - LP token mint derivation
  - Program signing for LP operations

This structure enables a complete AMM with configurable fees, emergency controls, and proper PDA management for both the config and LP token systems.
*/