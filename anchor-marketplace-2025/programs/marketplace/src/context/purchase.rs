use anchor_lang::{prelude::*, system_program::{transfer, Transfer}};
use anchor_spl::{associated_token::AssociatedToken, metadata::{MasterEditionAccount, Metadata, MetadataAccount}, token::{close_account, mint_to, transfer_checked, CloseAccount, MintTo, TransferChecked}, token_interface::{Mint, TokenAccount, TokenInterface}};

use crate::state::{Listing, Marketplace};


#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(mut)]
    pub taker: Signer<'info>,
    #[account(mut)]
    pub maker: SystemAccount<'info>,
    #[account(
        mut,
        associated_token::mint = maker_mint,
        associated_token::authority = listing,
    )]
    pub vault: InterfaceAccount<'info, TokenAccount>,

    pub maker_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        seeds = [b"treasury", marketplace.key().as_ref()],
        bump,
    )]
    pub treasury: SystemAccount<'info>,

    #[account(
        init_if_needed,
        payer = taker, 
        associated_token::mint = maker_mint,
        associated_token::authority = taker,
        
    )]
    pub taker_ata: InterfaceAccount<'info, TokenAccount>,

    #[account(
        seeds = [b"marketplace", marketplace.name.as_str().as_bytes()],
        bump = marketplace.bump,
    )]
    pub marketplace: Account<'info, Marketplace>,

    pub associated_token_program: Program<'info, AssociatedToken>, // For creating ATAs
    pub system_program: Program<'info, System>, // For creating accounts
    pub token_program: Interface<'info, TokenInterface> // For token operations

}

impl <'info> Purchase<'info> {

    pub fn purchase(&mut self ) -> Result<()> {

        //send sol
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer{
            from: self.taker.to_account_info(), // Source of the NFT
           // mint: self.maker_mint.to_account_info(), // NFT mint 
            to: self.maker.to_account_info(), // Destination vault
           // authority: self.maker.to_account_info(), // Authority to move the token
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, self.listing.price - self.marketplace.fee)



    }

    pub fn purchase_nft(&mut self) ->Result<()>{
        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked{
            from: self.vault.to_account_info(), // Source of the NFT
            mint: self.maker_mint.to_account_info(), // NFT mint 
            to: self.taker_ata.to_account_info(), // Destination 
            authority: self.listing.to_account_info(), // Authority to move the token
        };

        let signer_seeds  = &[]; //listing seeeds since listing is authority?         seeds = [marketplace.key().as_ref(), maker_mint.key().as_ref()],



        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer_checked(cpi_ctx, self.maker_ata.amount, self.maker_mint.decimals)?;

        Ok(())
    }
}