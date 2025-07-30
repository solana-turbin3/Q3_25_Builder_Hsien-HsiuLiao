use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{mint_to, Mint, MintTo, Token, TokenAccount}};

use crate::{errors::StakeError, state::{StakeConfig, UserAccount}};

/*
This instruction allows a user to claim their accumulated points and receive rewards tokens.

Accounts:
- user: The user who is claiming the rewards
- config: The configuration account for the staking program
- user_account: The user's account for tracking points
- user_rewards_ata: The associated token account for the rewards tokens
- rewards_mint: The mint account for the rewards tokens
- system_program: The system program
- token_program: The token program
- associated_token_program: The associated token program

Functionality:
Points Calculation: Uses the accumulated points in the user's account (not current staked amount)
Validation: Ensures there are points to claim (> 0)
Token Minting: Mints reward tokens (1:1 ratio with points) to the user's wallet
Points Reset: Resets the user's points to 0 after claiming
Integration with Other Instructions:
Stake: Adds points to user account when NFTs are staked
Unstake: Removes points from user account when NFTs are unstaked
Claim: Allows users to convert accumulated points to reward tokens
Key Features:
PDA-based rewards mint: Uses a program-derived address for the rewards token mint
Automatic token account creation: Uses Associated Token Program for seamless token account management
Points accumulation: Points are earned when staking and lost when unstaking
One-time claiming: Points are reset to 0 after claiming, preventing double-spending
The system now provides a complete NFT staking and rewards mechanism where users can stake NFTs, accumulate points over time, and claim reward tokens based on their staking activity.
*/

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        seeds = [b"config".as_ref()],
        bump = config.bump,
    )]
    pub config: Account<'info, StakeConfig>,
    #[account(
        mut,
        seeds = [b"user".as_ref(), user.key().as_ref()],
        bump = user_account.bump,
    )]
    pub user_account: Account<'info, UserAccount>,
    #[account(
        init_if_needed,
        payer = user,
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
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

impl<'info> Claim<'info> {
    pub fn claim(&mut self) -> Result<()> {
        // Use accumulated points from user account
        let points_to_claim = self.user_account.points;
        
        require!(
            points_to_claim > 0,
            StakeError::NoPointsToClaim
        );

        // Calculate rewards tokens to mint (1 token per point)
        let tokens_to_mint = points_to_claim;

        // Mint rewards tokens to user
        let seeds = &[
            b"config".as_ref(),
            &[self.config.bump]
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = MintTo {
            mint: self.rewards_mint.to_account_info(),
            to: self.user_rewards_ata.to_account_info(),
            authority: self.config.to_account_info(),
        };

        let cpi_ctx = CpiContext::new_with_signer(
            self.token_program.to_account_info(),
            cpi_accounts,
            signer_seeds,
        );

        mint_to(cpi_ctx, tokens_to_mint as u64)?;

        // Reset user points to 0 after claiming
        self.user_account.points = 0;

        Ok(())
    }
}