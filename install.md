$ npx mucho install
Need to install the following packages:
mucho@0.10.0
Ok to proceed? (y) y

 mucho update available - v0.10.0 
   To install the latest version, run the following command:
   npx mucho@latest self-update

 Install Solana development tools 
✔ mucho 0.10.0 installed
ℹ rust 1.85.1 is already installed
Unable to detect the 'cargo install-update' command. Installing...
✔ cargo-update 16.3.2 installed
ℹ solana 2.1.1 is already installed
ℹ avm 0.31.0 is already installed - update available
ℹ anchor 0.31.0 is already installed - v0.31.1 available
✔ solana-verify 0.4.8 installed
Unable to detect Docker (which is required for 'solana-verify'). Do you have it installed?
To install Docker, follow the instructions in the official Docker documentation: 
https://docs.docker.com/engine/install/
ℹ yarn 1.22.2 is already installed

$ avm use 0.31.1
Version 0.31.1 is not installed. Would you like to install? [y/n]
y
Now using anchor version 0.31.1.

$ rustup update
info: syncing channel updates for 'stable-x86_64-unknown-linux-gnu'
info: latest update on 2025-06-26, rust version 1.88.0 (6b00bc388 2025-06-23)
info: downloading component 'rust-src'
info: downloading component 'cargo'
  9.5 MiB /   9.5 MiB (100 %)   3.6 MiB/s in  2s         
info: downloading component 'clippy'
info: downloading component 'rust-docs'
 20.1 MiB /  20.1 MiB (100 %)   3.5 MiB/s in  5s         
info: downloading component 'rust-std'
 29.5 MiB /  29.5 MiB (100 %)   3.6 MiB/s in  8s         
info: downloading component 'rustc'
 76.3 MiB /  76.3 MiB (100 %)   3.6 MiB/s in 23s         
info: downloading component 'rustfmt'
info: removing previous version of component 'rust-src'
info: removing previous version of component 'cargo'
info: removing previous version of component 'clippy'
info: removing previous version of component 'rust-docs'
info: removing previous version of component 'rust-std'
info: removing previous version of component 'rustc'
info: removing previous version of component 'rustfmt'
info: installing component 'rust-src'
info: installing component 'cargo'
info: installing component 'clippy'
info: installing component 'rust-docs'
 20.1 MiB /  20.1 MiB (100 %)   8.0 MiB/s in  2s         
info: installing component 'rust-std'
 29.5 MiB /  29.5 MiB (100 %)  12.8 MiB/s in  2s         
info: installing component 'rustc'
 76.3 MiB /  76.3 MiB (100 %)  14.1 MiB/s in  5s         
info: installing component 'rustfmt'
info: syncing channel updates for 'nightly-x86_64-unknown-linux-gnu'
info: latest update on 2025-07-05, rust version 1.90.0-nightly (e3843659e 2025-07-04)
info: downloading component 'cargo'
  9.7 MiB /   9.7 MiB (100 %)   3.5 MiB/s in  2s         
info: downloading component 'clippy'
  4.3 MiB /   4.3 MiB (100 %)   3.5 MiB/s in  1s         
info: downloading component 'rust-docs'
 20.6 MiB /  20.6 MiB (100 %)   3.6 MiB/s in  6s         
info: downloading component 'rust-std'
 27.6 MiB /  27.6 MiB (100 %)   3.6 MiB/s in  8s         
info: downloading component 'rustc'
 77.8 MiB /  77.8 MiB (100 %)   3.6 MiB/s in 22s         
info: downloading component 'rustfmt'
  2.2 MiB /   2.2 MiB (100 %)   2.2 MiB/s in  1s         
info: removing previous version of component 'cargo'
info: removing previous version of component 'clippy'
info: removing previous version of component 'rust-docs'
info: removing previous version of component 'rust-std'
info: removing previous version of component 'rustc'
info: removing previous version of component 'rustfmt'
info: installing component 'cargo'
info: installing component 'clippy'
info: installing component 'rust-docs'
 20.6 MiB /  20.6 MiB (100 %)   8.8 MiB/s in  2s         
info: installing component 'rust-std'
 27.6 MiB /  27.6 MiB (100 %)  13.8 MiB/s in  2s         
info: installing component 'rustc'
 77.8 MiB /  77.8 MiB (100 %)  15.5 MiB/s in  5s         
info: installing component 'rustfmt'
info: checking for self-update
info: downloading self-update

   stable-x86_64-unknown-linux-gnu updated - rustc 1.88.0 (6b00bc388 2025-06-23) (from rustc 1.85.1 (4eb161250 2025-03-15))
  nightly-x86_64-unknown-linux-gnu updated - rustc 1.90.0-nightly (e3843659e 2025-07-04) (from rustc 1.88.0-nightly (e643f59f6 2025-04-07))
