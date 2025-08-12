use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub rewards_bump: u8,
    pub bump: u8,
}