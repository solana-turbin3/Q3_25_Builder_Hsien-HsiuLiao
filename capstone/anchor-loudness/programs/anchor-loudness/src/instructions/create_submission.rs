use anchor_lang::prelude::*;

use crate::state::{UserAccount, Venue, Submission, Config, SoundLevelData};

#[derive(Accounts)]
#[instruction(venue_name: String)]
pub struct CreateSubmission<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(

        seeds = [b"loudness_config".as_ref()],
        bump,
    )]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [b"user".as_ref(), user.key().as_ref()],
        bump,
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
        init_if_needed,
        payer = user,
        seeds = [config.key().as_ref(), venue_name.as_str().as_bytes()],
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

impl<'info> CreateSubmission<'info> {
    
    pub fn create_submission(&mut self, 
        sound_level_data: SoundLevelData,
        bumps: &CreateSubmissionBumps) -> Result<()> {
            self.submission.set_inner(Submission {
                venue: self.venue.key(),
                concert_goer: self.user.key(),
                sound_level_data,
                bump: bumps.submission,
            });
      
      //user get 1 point for submitting a submission
      self.user_account.num_of_submissions += 1;
      self.user_account.points_to_claim += 1;
        Ok(())
    }
} 