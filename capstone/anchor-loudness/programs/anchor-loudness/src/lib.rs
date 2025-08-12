use anchor_lang::prelude::*;

declare_id!("3chRm8Uw232StQpy6G5nVAokSz7bTiUN4e6pvB95PRw2");

mod state;
mod instructions;
mod errors;

pub use instructions::*;
pub use state::*;
pub use errors::*;

#[program]
pub mod anchor_loudness {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
        ctx.accounts.initialize_config( &ctx.bumps)
    }

    pub fn initialize_user(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize_user(&ctx.bumps)
    }

   

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        ctx.accounts.claim()
    }
}


