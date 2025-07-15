use anchor_lang::prelude::*;

declare_id!("HdrLqs3W78xGRbfn1oCi4XAkrnTL3yg2DoQt83a95TsM");

#[program]
pub mod amm {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
