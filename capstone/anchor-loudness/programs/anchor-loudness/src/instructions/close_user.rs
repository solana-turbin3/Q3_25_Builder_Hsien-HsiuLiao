use anchor_lang::prelude::*;

use crate::state::UserAccount;

#[derive(Accounts)]
pub struct CloseUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
     mut, 
     close = user,
    )]
    pub user_account: Account<'info, UserAccount>,
    pub system_program: Program<'info, System>,
}

impl<'info> CloseUser<'info> {
    
    pub fn close_user(&mut self, bumps: &CloseUserBumps) -> Result<()> {
       
        Ok(())
    }
} 