'use client'

import { getJournalprogramProgram, getJournalprogramProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useJournalprogramProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getJournalprogramProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getJournalprogramProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['journalprogram', 'all', { cluster }],
    queryFn: () => program.account.journalprogram.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['journalprogram', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ journalprogram: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useJournalprogramProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useJournalprogramProgram()

  const accountQuery = useQuery({
    queryKey: ['journalprogram', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalprogram.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['journalprogram', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ journalprogram: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['journalprogram', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ journalprogram: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['journalprogram', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ journalprogram: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['journalprogram', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ journalprogram: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
