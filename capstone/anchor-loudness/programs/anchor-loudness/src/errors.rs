use anchor_lang::error_code;

#[error_code]
pub enum Error {
    #[msg("Not admin")]
    NotAdmin,
    #[msg("Not enough lamports")]
    NotEnoughLamports,
    #[msg("No points to claim")]
    NoPointsToClaim,
    
}