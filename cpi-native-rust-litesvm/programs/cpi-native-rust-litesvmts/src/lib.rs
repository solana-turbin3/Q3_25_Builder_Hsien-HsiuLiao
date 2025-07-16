use anchor_lang::prelude::*;

declare_id!("JBQmF5pQzG2jo2i26QjSnuFvzmTqutBCUDmdJk3hcd6u");

#[program]
pub mod cpi_native_rust_litesvmts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
