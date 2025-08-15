use anchor_lang::prelude::*;

use crate::state::{UserAccount, Venue, Submission, Config};

#[derive(Accounts)]
#[instruction(venue_name: String)]
pub struct CloseSubmission<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        seeds = [b"loudness_config".as_ref()],
        bump,
    )]
    pub config: Account<'info, Config>,
    #[account(
     
        seeds = [b"user".as_ref(), user.key().as_ref()],
        bump,
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
       
        seeds = [config.key().as_ref(), venue_name.as_str().as_bytes()],
        bump,
        )]
    pub venue: Account<'info, Venue>,
    #[account(
        mut,     
        seeds = [venue.key().as_ref(), user.key().as_ref()],
        bump,
        close = user,
 
    )]
    pub submission: Account<'info, Submission>,
    pub system_program: Program<'info, System>,
}

impl<'info> CloseSubmission<'info> {
    
    pub fn close_submission(&mut self) -> Result<()> {
        // Check if there are submissions to close
            self.user_account.num_of_submissions = self.user_account.num_of_submissions.saturating_sub(1);
        
        
        Ok(())
    }
} 