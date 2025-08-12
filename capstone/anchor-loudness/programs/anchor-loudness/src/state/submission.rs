use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Submission {
    pub concert_goer: Pubkey,
    pub sound_level: u8,
    pub seat_number: u8,
    pub user_rating: u8,
    pub bump: u8,
}