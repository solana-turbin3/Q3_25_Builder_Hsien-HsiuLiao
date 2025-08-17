use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    pub num_of_submissions: u8,
    pub points_to_claim: u8,
    pub bump: u8,
}