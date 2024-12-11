import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Journalprogram} from '../target/types/journalprogram'

describe('journalprogram', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Journalprogram as Program<Journalprogram>

  const journalprogramKeypair = Keypair.generate()

  it('Initialize Journalprogram', async () => {
    await program.methods
      .initialize()
      .accounts({
        journalprogram: journalprogramKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([journalprogramKeypair])
      .rpc()

    const currentCount = await program.account.journalprogram.fetch(journalprogramKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Journalprogram', async () => {
    await program.methods.increment().accounts({ journalprogram: journalprogramKeypair.publicKey }).rpc()

    const currentCount = await program.account.journalprogram.fetch(journalprogramKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Journalprogram Again', async () => {
    await program.methods.increment().accounts({ journalprogram: journalprogramKeypair.publicKey }).rpc()

    const currentCount = await program.account.journalprogram.fetch(journalprogramKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Journalprogram', async () => {
    await program.methods.decrement().accounts({ journalprogram: journalprogramKeypair.publicKey }).rpc()

    const currentCount = await program.account.journalprogram.fetch(journalprogramKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set journalprogram value', async () => {
    await program.methods.set(42).accounts({ journalprogram: journalprogramKeypair.publicKey }).rpc()

    const currentCount = await program.account.journalprogram.fetch(journalprogramKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the journalprogram account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        journalprogram: journalprogramKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.journalprogram.fetchNullable(journalprogramKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
