use anchor_lang::{prelude::*, solana_program::clock, system_program::{transfer, Transfer}};
use switchboard_on_demand::on_demand::accounts::pull_feed::PullFeedAccountData;
//use switchboard_on_demand::prelude::rust_decimal::Decimal;


use crate::{ state::{}};

#[derive(Accounts)]
pub struct SwitchboardFeed<'info> {
    //safety check: Struct field "feed" is unsafe, but is not documented.   add ///CHECK
        /// CHECK: via switchboard sdk
    pub feed: AccountInfo<'info>,
    pub system_program: Program<'info, System>,

}

impl <'info> SwitchboardFeed<'info> {
   
    pub fn get_feed_data(&mut self) -> Result<()> { 
      // Feed account data
      let feed_account = self.feed.data.borrow();//ctx.accounts.feed.data.borrow();
       // Verify that this account is the intended one by comparing public keys
       // if ctx.accounts.feed.key != &specific_pubkey {
       //     throwSomeError
       // }
       //

       // Docs at: https://switchboard-on-demand-rust-docs.web.app/on_demand/accounts/pull_feed/struct.PullFeedAccountData.html
       let feed = PullFeedAccountData::parse(feed_account).unwrap();
      
       let clock = Clock::get()?;

       //this section may not be needed
       let max_staleness = 200;
        let min_samples = 7;
        let only_positive = true;

        let value = feed.get_value(&clock, max_staleness, min_samples, only_positive);
        msg!("feed value: {:?}", value);

      // msg!(" clock: {:?}", &clock);
       msg!("decibels: {:?}", feed.value(&clock));
      
       Ok(())
       
        }

    
}

