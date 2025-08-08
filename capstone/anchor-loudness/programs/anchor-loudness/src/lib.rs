use anchor_lang::prelude::*;

declare_id!("3chRm8Uw232StQpy6G5nVAokSz7bTiUN4e6pvB95PRw2");

#[program]
pub mod anchor_loudness {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
