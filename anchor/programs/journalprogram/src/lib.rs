#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("5oa7L4NnRQ4D1XG59F65dV1ENkqknSoxstdi8Mu9Lhho");

#[program]
pub mod journalprogram {
    use super::*;

    pub fn add_journal(context: Context<AddJournal>, title: String, message: String) -> Result<()> {
        let journal = &mut context.accounts.journal;
        journal.owner = *context.accounts.signer.key;
        journal.title = title;
        journal.message = message;

        Ok(())
    }

    pub fn update_journal(
        context: Context<UpdateJournal>,
        _title: String,
        message: String,
    ) -> Result<()> {
        let journal = &mut context.accounts.journal;
        journal.message = message;
        Ok(())
    }

    pub fn delete_journal(_context: Context<DeleteJournal>, _title: String) -> Result<()> {
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Journal {
    pub owner: Pubkey,

    #[max_len(100)]
    pub title: String,

    #[max_len(250)]
    pub message: String,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct AddJournal<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
      init,
      payer = signer,
      space = 8 + Journal::INIT_SPACE,
      seeds = [signer.key().as_ref(), title.as_bytes()],
      bump
    )]
    pub journal: Account<'info, Journal>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct UpdateJournal<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
      mut,
      seeds=[signer.key().as_ref(), title.as_bytes()],
      bump,
      realloc = 8 + Journal::INIT_SPACE,
      realloc::payer = signer,
      realloc::zero = true
    )]
    pub journal: Account<'info, Journal>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct DeleteJournal<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
      mut,
      seeds=[signer.key().as_ref(), title.as_bytes()],
      bump,
      close = signer
    )]
    pub journal: Account<'info, Journal>,

    pub system_program: Program<'info, System>,
}
