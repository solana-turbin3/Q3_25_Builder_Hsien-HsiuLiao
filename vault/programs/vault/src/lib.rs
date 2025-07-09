#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

declare_id!("9mty1m2J4XajzDPSyUgdH8iq7bRtN1SXNhwewAi3M2SA");

#[program]
pub mod vault {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        ctx.accounts.initialize(&ctx.bumps)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user, 
        seeds = [b"state", user.key.as_ref()],
        bump,
        space = 8 + VaultState::INIT_SPACE

    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(
        
        seeds = [b"vault", vault_state.key().as_ref()],
        bump,
    )]
    pub vault: SystemAccount<'info>,
    #[account()]
    pub system_program: Program<'info, System>
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, bumps: &InitializeBumps) -> Result<()> {
        Ok(())
    }
}

#[account]
pub struct VaultState {
    pub vault_bump: u8,
    pub vaultstate_bump: u8
}

impl Space for VaultState {
    const INIT_SPACE: usize = 1 + 1;
}