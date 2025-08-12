use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Venue {
    #[max_len(32)] 
    pub name: String,
    pub bump: u8,
}