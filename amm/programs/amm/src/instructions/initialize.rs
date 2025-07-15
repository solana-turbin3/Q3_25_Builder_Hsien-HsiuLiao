use anchor_lang::prelude::*;

use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount}
};

use crate::state::Config;

// Anchor programs always use 8 bits for the discriminator
pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8; // written to every account on the blockchain by anchor, specifies the type of account, used by anchor for some of its checks
                                                // so this will be 8 bytes

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    
    pub mint_x: Account<'info, Mint>, 
    pub mint_y: Account<'info, Mint>,

    #[account(
        init, 
        payer = initializer, 
        seeds = [b"lp", config.key.as_ref()], 
        bump, 
        mint::decimals = 6, 
        mint::authority = config
    )]
    pub mint_lp: Account<'info, Mint>,
    #[account(
        init, 
        payer = initializer,
        associated_token::mint = mint_x,
        associated_token::authority = config,

    )]
    pub vault_x: Account<'info, TokenAccount>, // to hold tokens
    #[account(
        init, 
        payer = initializer,
        associated_token::mint = mint_y,
        associated_token::authority = config,

    )]
    pub vault_y: Account<'info, TokenAccount>, // to hold tokens

    #[account(
        init, 
        payer = initializer, 
        seeds = [b"config", seed.to_le_bytes().as_ref()],
        bump, 
        space = ANCHOR_DISCRIMINATOR_SIZE + Config::INIT_SPACE
    )]
    pub config: Account<'info, Config>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>



}


//setup config

impl<'info> Initialize<'info> {

    pub fn init(&mut self, seed: u64, fee: u16, authority:Option<Pubkey>, bumps: InitializeBumps   ) -> Result<()>{
        self.config.set_inner(Config { 
            seed,
            authority, 
            mint_x: self.mint_x.key(), 
            mint_y: self. mint_y.key(),
            fee,
            locked: false,  //lock status of protocol
            config_bump: bumps.config, 
            lp_bump: bumps.mint_lp 
        });

        Ok(())
    }

}