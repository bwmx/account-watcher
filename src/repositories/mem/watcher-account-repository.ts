import type { WatcherAccount } from '../../types/watcher-account'
import type { IWatcherAccountRepository } from '../interface-type'

// in memory version of a repository implementing the WatcherAccountRepository interface
export class MemRepository implements IWatcherAccountRepository {
  private watcherAccounts: WatcherAccount[] = []

  async create(address: string, balance: bigint, lastUpdatedRound: bigint): Promise<WatcherAccount> {
    if (this.watcherAccounts.find((val) => val.address === address) !== undefined) {
      // account already exists
      throw new Error('account already exists')
    }

    // create new watcher account
    const watcherAccount: WatcherAccount = {
      address: address,
      balance: balance,
      lastUpdatedRound: lastUpdatedRound,
    }

    // add to array
    this.watcherAccounts.push(watcherAccount)

    return watcherAccount
  }

  async get(address: string): Promise<WatcherAccount | undefined> {
    return this.watcherAccounts.find((value) => value.address === address)
  }

  async getAll(): Promise<WatcherAccount[]> {
    return this.watcherAccounts
  }

  async update(address: string, balance: bigint, lastUpdatedRound: bigint): Promise<WatcherAccount> {
    const index = this.watcherAccounts.findIndex((val) => val.address === address)
    if (index === -1) {
      // not found
      throw new Error('account not found')
    }

    const current = this.watcherAccounts[index]
    if (current === undefined) {
      // not found
      throw new Error('account not found')
    }

    const updatedAccount = {
      ...current, // spread because WatcherAccount type might change in future
      balance,
      lastUpdatedRound,
    }

    // update in internal memory array
    this.watcherAccounts[index] = updatedAccount

    return updatedAccount
  }
}
