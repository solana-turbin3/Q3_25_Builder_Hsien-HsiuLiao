use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace, PartialEq, Eq)]
pub struct Submission {
    pub venue: Pubkey, 
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

/*
venue: 32 bytes (Pubkey)
concert_goer: 32 bytes (Pubkey)
sound_level_data.sound_level: 1 byte (u8)
sound_level_data.timestamp: 8 bytes (i64)
sound_level_data.seat_number: 1 byte (u8)
sound_level_data.user_rating: 1 byte (u8)
bump: 1 byte (u8)
Total: 76 bytes + 8 bytes discriminator = 84 bytes

https://www.anchor-lang.com/docs/references/space
*/