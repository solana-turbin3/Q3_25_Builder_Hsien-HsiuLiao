use anchor_lang::prelude::*;
use anchor_spl::token::Token;

use crate::state::Config;
use crate::errors::Error;

/* 
onlt admin can close config
*/

#[derive(Accounts)]
pub struct CloseConfig<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    #[account(
        mut,
       close = admin,
    )]
    pub config: Account<'info, Config>,
  /*   #[account(
        mut, 
        close = admin,
    )]
    pub rewards_mint: Account<'info, Mint>, */
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
  
}

impl<'info> CloseConfig<'info> {
    pub fn close_config(&mut self,  bumps: &CloseConfigBumps) -> Result<()> {
       //require admin
        require!(self.config.admin == self.admin.key(), Error::NotAdmin);
/* 
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = CloseAccount {
            account: self.rewards_mint.to_account_info(),
            destination: self.admin.to_account_info(),
            authority: self.rewards_mint.to_account_info()
        };


        let rewards_pda_signing_seeds= &[
            b"rewards".as_ref(),
            self.config.to_account_info().key.as_ref(),
            &[self.config.rewards_bump]
        ];

        let signer_seeds:  &[&[&[u8]]] = &[&rewards_pda_signing_seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);
        close_account(cpi_ctx)?; */
        Ok(())
    }
}