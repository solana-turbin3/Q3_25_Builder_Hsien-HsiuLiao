use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub seed: u64,
    pub maker: Pubkey,
    pub mint_a: Pubkey,
    pub mint_b: Pubkey, //mint address of token maker wants to receive
    pub receive: u64,   //when initializing escrow program, maker specifies the amount of token_b they want to receive
    pub bump: u8
}

/*
Looking at the `Escrow` struct fields, here's why each one is needed:

- **`seed: u64`** - Unique identifier for the escrow. Used in PDA derivation to create a deterministic address for each escrow instance. Without this, you couldn't have multiple escrows.

- **`maker: Pubkey`** - The user who created the escrow offer. Essential for:
  - Authorization (only maker can refund)
  - Tracking ownership
  - Displaying who made the offer

- **`mint_a: Pubkey`** - The token mint address for the first token in the swap. Required to identify what token the maker is offering.

- **`mint_b: Pubkey`** - The token mint address for the second token in the swap. Required to identify what token the maker wants to receive.

- **`receive: u64`** - The amount of `mint_b` tokens the maker wants to receive. This defines the exchange rate/terms of the swap.

- **`bump: u8`** - The bump seed used in PDA derivation. Required because:
  - PDAs need a bump to avoid address collisions
  - The program needs to know this bump to sign for the escrow account when making CPIs

Without any of these fields, the escrow program couldn't function properly - you'd lose the ability to track ownership, define swap terms, or manage the escrow account securely.
*/