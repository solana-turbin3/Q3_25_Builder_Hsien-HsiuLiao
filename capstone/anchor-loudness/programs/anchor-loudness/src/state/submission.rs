use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace, PartialEq, Eq)]
pub struct Submission {
    pub concert_goer: Pubkey,
    pub sound_level_data: SoundLevelData,
    pub bump: u8,
}

#[derive(InitSpace,AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub struct SoundLevelData {
    pub sound_level: u8,
    pub timestamp: i64,
    pub seat_number: u8,
    pub user_rating: u8,
}