#![allow(unexpected_cfgs, deprecated)]

use anchor_lang::prelude::*;

mod instructions;
mod state;

use instructions::*;

declare_id!("HdrLqs3W78xGRbfn1oCi4XAkrnTL3yg2DoQt83a95TsM");

#[program]
pub mod amm {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        seed: u64, 
        fee: u16, 
        authority: Option<Pubkey>,

    ) -> Result<()> {
        ctx.accounts.init(seed, fee, authority, ctx.bumps)?;

        Ok(())
    }

   /*  pub fn deposit(
        ctx: Context<Deposit>,
        amount: u64, //amount of lp tokens that depositor wants to get back 
        max_x: u64, //max x tokens depositor willing to deposit
        max_y: u64 //max y tokens depositor willing to deposit
                    //these are needed to avoid slippage
    ) -> Result<()> {
        ctx.accounts.deposit(amount, max_x, max_y)?;

        Ok(())
    } */
}

