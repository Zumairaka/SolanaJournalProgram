// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import JournalprogramIDL from '../target/idl/journalprogram.json'
import type { Journalprogram } from '../target/types/journalprogram'

// Re-export the generated IDL and type
export { Journalprogram, JournalprogramIDL }

// The programId is imported from the program IDL.
export const JOURNALPROGRAM_PROGRAM_ID = new PublicKey(JournalprogramIDL.address)

// This is a helper function to get the Journalprogram Anchor program.
export function getJournalprogramProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...JournalprogramIDL, address: address ? address.toBase58() : JournalprogramIDL.address } as Journalprogram, provider)
}

// This is a helper function to get the program ID for the Journalprogram program depending on the cluster.
export function getJournalprogramProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Journalprogram program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return JOURNALPROGRAM_PROGRAM_ID
  }
}
