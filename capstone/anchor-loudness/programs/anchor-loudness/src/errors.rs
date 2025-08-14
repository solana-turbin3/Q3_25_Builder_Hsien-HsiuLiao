use anchor_lang::error_code;

#[error_code]
pub enum Error {
    #[msg("Not admin")]
    NotAdmin,
    #[msg("Not enough lamports")]
    NotEnoughLamports,
    #[msg("Not enough tokens")]
    NotEnoughTokens,
    #[msg("Not enough rewards")]
    NotEnoughRewards,
    
}