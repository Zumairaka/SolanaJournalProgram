#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod journalprogram {
    use super::*;

  pub fn close(_ctx: Context<CloseJournalprogram>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.journalprogram.count = ctx.accounts.journalprogram.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.journalprogram.count = ctx.accounts.journalprogram.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeJournalprogram>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.journalprogram.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeJournalprogram<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Journalprogram::INIT_SPACE,
  payer = payer
  )]
  pub journalprogram: Account<'info, Journalprogram>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseJournalprogram<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub journalprogram: Account<'info, Journalprogram>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub journalprogram: Account<'info, Journalprogram>,
}

#[account]
#[derive(InitSpace)]
pub struct Journalprogram {
  count: u8,
}
