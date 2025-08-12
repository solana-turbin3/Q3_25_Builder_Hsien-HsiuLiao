use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

use crate::state::Config;

/* First we need to initialize Config. We need 
an admin who will be the signer,
config account where will store info, 
rewards_mint, a mint account with config as authority
system_program
and token_program  (needed for mint account)

initialize will set 
*/

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        init, 
        payer = admin,
        seeds = [b"loudness_config".as_ref()],
        bump,
        space = 8 + Config::INIT_SPACE,
    )]
    pub config: Account<'info, Config>,
    #[account(
        init_if_needed,
        payer = admin,
        seeds = [b"rewards".as_ref(), config.key().as_ref()],
        bump,
        mint::decimals = 6,
        mint::authority = config,
    )]
    pub rewards_mint: Account<'info, Mint>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

impl<'info> InitializeConfig<'info> {
    pub fn initialize_config(&mut self,  bumps: &InitializeConfigBumps) -> Result<()> {
        self.config.set_inner(Config {
           admin: self.admin.key(),
           rewards_token_mint: self.rewards_mint.key(),
            rewards_bump: bumps.rewards_mint,
            bump: bumps.config,
        });
 
        Ok(())
    }
}