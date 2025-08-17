use anchor_lang::prelude::*;
use anchor_spl::token::{burn, Burn, Mint, Token, TokenAccount};

use crate::state::{UserAccount, Venue, Submission, Config};
use crate::errors::Error;

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
        mut,
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
    #[account(
        mut,
        associated_token::mint = rewards_mint,
        associated_token::authority = user,
    )]
    pub user_rewards_ata: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"rewards".as_ref(), config.key().as_ref()],
        bump = config.rewards_bump,
    )]
    pub rewards_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> CloseSubmission<'info> {
    
    pub fn close_submission(&mut self) -> Result<()> {
        // Check if there are submissions to close
        require!(
            self.user_account.num_of_submissions > 0,
            Error::NoSubmissionsToClose
        );
        
        // Decrease submission count by 1
        self.user_account.num_of_submissions = self.user_account.num_of_submissions.saturating_sub(1);
        
        // Check if user has claimed tokens and decrease token balance by 1
        let current_token_balance = self.user_rewards_ata.amount;
        
        if current_token_balance > 0 {
            // Burn 1 token from user's account
            let cpi_accounts = Burn {
                mint: self.rewards_mint.to_account_info(),
                from: self.user_rewards_ata.to_account_info(),
                authority: self.user.to_account_info(),
            };
            
            let cpi_ctx = CpiContext::new(
                self.token_program.to_account_info(),
                cpi_accounts,
            );
            
            burn(cpi_ctx, 1)?;
            
            msg!("Burned 1 token from user account. New balance: {}", current_token_balance - 1);
        } else {
            msg!("User has no tokens to burn. Submission count decreased.");
        }
        
        Ok(())
    }
} 