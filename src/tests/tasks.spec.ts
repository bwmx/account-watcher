import { afterAll, beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

import * as algokit from '@algorandfoundation/algokit-utils'
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { registerDebugEventHandlers } from '@algorandfoundation/algokit-utils-debug'
import { MemRepository } from '../repositories/mem/watcher-account-repository'
import { getAccountBalance } from '../utils/algorand'
import { syncWatcherAccounts } from '../tasks'

describe('Test tasks.ts', () => {
  const localnet = algorandFixture()

  beforeAll(() => {
    algokit.Config.configure({
      debug: true,
      // traceAll: true,
    })
    registerDebugEventHandlers()
  })
  beforeEach(localnet.newScope)

  test('syncWatcherAccounts() works correctly when no changes are detected', async () => {
    const { testAccount } = localnet.context
    const memRepo = new MemRepository()

    const address = testAccount.toString()
    const { balance, validAsOfRound } = await getAccountBalance(address)

    const r = await memRepo.create(address, balance, validAsOfRound)
    expect(r).toStrictEqual({
      address,
      balance,
      lastUpdatedRound: validAsOfRound,
    })

    const all = await memRepo.getAll()
    expect(all.length).toEqual(1)

    // should not throw any errors
    await expect(syncWatcherAccounts(memRepo)).resolves.not.toThrow()
    // get the value from repo to check
    const newValue = await memRepo.get(address)
    // should be the same as when we created it
    expect(newValue).toStrictEqual(r)
  })

  test(
    'syncWatcherAccounts() updates stored account state when changes are detected',
    async () => {
      const { testAccount } = localnet.context
      const memRepo = new MemRepository()

      const address = testAccount.toString()
      const { balance, validAsOfRound } = await getAccountBalance(address)

      const r = await memRepo.create(address, balance, validAsOfRound)
      expect(r).toStrictEqual({
        address,
        balance,
        lastUpdatedRound: validAsOfRound,
      })

      const all = await memRepo.getAll()
      expect(all.length).toEqual(1)

      const dispenser = await localnet.algorand.account.dispenserFromEnvironment()

      await localnet.algorand.send.payment({
        sender: dispenser.account.addr.toString(),
        receiver: address,
        amount: (1).algos(),
      })

      // TODO: wait for txn to be confirmed in in the algod instance state
      // when syncWatcherAccounts() is called within the expect()
      // the code below gets executed before the repo has been updated (as in not complete)

      // should not throw any errors
      await expect(syncWatcherAccounts(memRepo)).resolves.not.toThrow()

      // get the value from repo to check
      const newValue = await memRepo.get(address)
      // should be the same as when we created it
      console.log(newValue)
      // should equal what we expect
      expect(newValue).toStrictEqual({
        ...r,
        balance: r.balance + (1).algos().microAlgos,
      })
    },
    { timeout: 60 * 10000 },
  )
})
