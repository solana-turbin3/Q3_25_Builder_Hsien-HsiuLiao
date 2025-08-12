use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Venue {
    pub name: String,
    pub bump: u8,
}