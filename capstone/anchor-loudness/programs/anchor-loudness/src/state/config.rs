use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub admin: Pubkey,
    pub rewards_token_mint: Pubkey,
    pub rewards_bump: u8,
    pub bump: u8,
}