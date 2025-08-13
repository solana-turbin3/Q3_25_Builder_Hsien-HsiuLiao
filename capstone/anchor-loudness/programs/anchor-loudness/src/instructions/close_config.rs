use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

use crate::state::Config;

/* 
onlt admin can close config
*/

#[derive(Accounts)]
pub struct CloseConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
       close = admin,
    )]
    pub config: Account<'info, Config>,
    #[account(
        mut, 
        close = admin,
    )]
    pub rewards_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl<'info> CloseConfig<'info> {
    pub fn initialize_config(&mut self,  bumps: &CloseConfigBumps) -> Result<()> {
       //require admin
 
        Ok(())
    }
}