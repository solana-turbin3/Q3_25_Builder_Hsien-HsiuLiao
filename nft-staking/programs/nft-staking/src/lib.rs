use anchor_lang::prelude::*;

declare_id!("4FmaVHmph346KkQuC9yj1Q8zB5XF4EBi94eLdbhYeXKk");

#[program]
pub mod nft_staking {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
