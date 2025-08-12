use anchor_lang::prelude::*;

use crate::state::UserAccount;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        seeds = [b"user".as_ref(), user.key().as_ref()],
        bump,
        space = 8 + UserAccount::INIT_SPACE,
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
        init_if_needed,
        payer = user,
        seeds = [program.key().as_ref(), venue_name.as_str().as_bytes()],
        bump,
        space = 8 + Venue::INIT_SPACE,
        )]
    pub venue: Account<'info, Venue>,
    #[account(
        init,
        payer = user,
        seeds = [venue.key().as_ref(), user.key().as_ref()],
        bump,
        space = 8 + Submission::INIT_SPACE,
    )]
    pub submission: Account<'info, Submission>,
    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    
    pub fn create_submission(&mut self) -> Result<()> {
      
        Ok(())
    }
} 