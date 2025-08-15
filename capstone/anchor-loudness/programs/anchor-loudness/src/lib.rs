#![allow(unexpected_cfgs, deprecated)]

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
        ctx.accounts.initialize_config(&ctx.bumps)
    }

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        ctx.accounts.initialize_user(&ctx.bumps)
    }

    pub fn get_sound_level<'a>(ctx: Context<SwitchboardFeed>) -> Result<()> {
        ctx.accounts.get_feed_data()?;
        Ok(())
    }

    pub fn create_submission(ctx: Context<CreateSubmission>, 
        venue_name: String,
        sound_level_data: SoundLevelData,
    ) -> Result<()> {
        ctx.accounts.create_submission(sound_level_data, &ctx.bumps)
    }


    

/*
    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        ctx.accounts.claim()
    } */

   /*  pub fn close_submission(ctx: Context<CloseSubmission>) -> Result<()> {
        ctx.accounts.close_submission()
    } */

    pub fn close_user(ctx: Context<CloseUser>) -> Result<()> {
        ctx.accounts.close_user(&ctx.bumps)
    }

    pub fn close_config(ctx: Context<CloseConfig>) -> Result<()> {
        ctx.accounts.close_config(&ctx.bumps)
    }
}


