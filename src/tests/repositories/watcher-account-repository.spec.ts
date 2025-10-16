import { describe, expect, test } from 'vitest'

import { MemRepository } from '../../repositories/mem/watcher-account-repository'
import { WatcherAccount } from '../../types/watcher-account'

import * as algosdk from 'algosdk'

describe('Test watcher-account-repository.ts', () => {
  test('initialises correctly', () => {
    const m = new MemRepository()

    expect(m).toBeDefined()
  })

  test('can add a new account', async () => {
    const m = new MemRepository()

    expect(m).toBeDefined()

    // make a new account/address
    const address = algosdk.generateAccount().addr.toString()
    const balance = 0n
    const lastUpdatedRound = 1n

    const newAccount: WatcherAccount = {
      address: address,
      balance: balance,
      lastUpdatedRound: lastUpdatedRound,
    }

    const created = await m.create(address, balance, lastUpdatedRound)

    expect(created).toStrictEqual(newAccount)
  })

  test('can get() an individual account', async () => {
    const m = new MemRepository()

    expect(m).toBeDefined()

    // make a new account/address
    const address = algosdk.generateAccount().addr.toString()
    const balance = 0n
    const lastUpdatedRound = 1n

    const newAccount: WatcherAccount = {
      address: address,
      balance: balance,
      lastUpdatedRound: lastUpdatedRound,
    }

    const created = await m.create(address, balance, lastUpdatedRound)

    expect(created).toStrictEqual(newAccount)

    // now get the account to check
    const returnedAccount = await m.get(address)

    // should return the account we just created
    expect(returnedAccount).toStrictEqual(newAccount)
  })

  test("should return undefined when get() account that isn't in repo", async () => {
    const m = new MemRepository()

    const address = algosdk.generateAccount().addr.toString()

    const r = await m.get(address)

    // should be undefined because it doesn't exist
    expect(r).toBeUndefined()
  })

  test('can call getAll() and view all tracked accounts', async () => {
    const m = new MemRepository()

    expect(m).toBeDefined()

    // util to generate and insert new account to watcher
    const addAccount = async (): Promise<WatcherAccount> => {
      // make a new account/address
      const address = algosdk.generateAccount().addr.toString()
      const balance = 0n
      const lastUpdatedRound = 1n

      const newAccount: WatcherAccount = {
        address: address,
        balance: balance,
        lastUpdatedRound: lastUpdatedRound,
      }

      const created = await m.create(address, balance, lastUpdatedRound)

      expect(created).toStrictEqual(newAccount)

      return created
    }

    const createdAccounts: WatcherAccount[] = []

    // insert 10 accounts into the watcher repo
    for (let i = 0; i < 10; i++) {
      const r = await addAccount()

      createdAccounts.push(r)
    }

    const r = await m.getAll()

    // should be 10 records in the database
    expect(r.length).toEqual(10)
  })

  test('can call update() and update an existing tracked account', async () => {
    const m = new MemRepository()

    expect(m).toBeDefined()

    // make a new account/address
    const address = algosdk.generateAccount().addr.toString()
    const balance = 0n
    const lastUpdatedRound = 1n

    const newAccount: WatcherAccount = {
      address: address,
      balance: balance,
      lastUpdatedRound: lastUpdatedRound,
    }

    const created = await m.create(address, balance, lastUpdatedRound)
    expect(created).toStrictEqual(newAccount)

    const newBalance = balance + 1n
    const newUpdatedRound = lastUpdatedRound + 1n

    const updated = await m.update(created.address, newBalance, newUpdatedRound)
    expect(updated).toStrictEqual({
      address: created.address,
      balance: newBalance,
      lastUpdatedRound: newUpdatedRound,
    })
  })
})
