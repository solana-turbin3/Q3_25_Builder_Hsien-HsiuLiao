prereq-rs]$ cargo test keygen -- --nocapture


    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.32s
     Running unittests src/lib.rs (target/debug/deps/prereq_rs-40c36507712e1bf6)

running 1 test

You've generated a new Solana wallet: FxtSYooJ5Tdpcia7XUvWKMRp7mzChS6kxWVTYSyEehtM

running 1 test
test tests::airdrop ... ok

successes:

---- tests::airdrop stdout ----
Success! Check your TX here:
https://explorer.solana.com/tx/5EBQKCSRHRWZDPY52ABRnqVBBtuuRme9Sg9jip9QR7bjXQxXoFBHRx4t5LQrGrfFztwTdHBkJjYi9ndNKe57FZQ4?cluster=devnet


successes:
    tests::airdrop

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 4 filtered out; finished in 1.21s

running 1 test
test tests::transfer_sol ... ok

successes:

---- tests::transfer_sol stdout ----
Verification failed
Success! Check out your TX here: https://explorer.solana.com/tx/2ZsmgQdszn8yrL217WkaQFYo3f4pFTPrdvynQh3Du3tB9sbbNbjsKHjjgm4zbZgWWmnHWNJHyQnfu8Jc1EWScYwE/?cluster=devnet


successes:
    tests::transfer_sol

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 4 filtered out; finished in 15.46s

running 1 test
test tests::transfer_sol ... ok

successes:

---- tests::transfer_sol stdout ----
Signature verified
Success! Check out your TX here: https://explorer.solana.com/tx/64TC4b9AK4yJ2jiRb5YRGAMsX1gdiU4vhzYyFg1B3NF9rmjbdqkg8pXaZ3TGD5b4sjagbv4SeGgtWZG34EsUNDnm/?cluster=devnet


successes:
    tests::transfer_sol

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 4 filtered out; finished in 14.49s