import type { WatcherAccount } from '../types/watcher-account'

// abstracted so can easily be replaced with file,db,any other method
// methods implementing this should follow the documented behavior
export interface IWatcherAccountRepository {
  /**
   * Add a new item to the repo
   * @param address address of account
   * @param balance current balance
   * @param lastUpdatedRound when balance was checked/queried
   * @throws Error if account already exists
   * @returns the newly created account
   */
  create(address: string, balance: bigint, lastUpdatedRound: bigint): Promise<WatcherAccount>
  /**
   * Get a single account stored in the repo
   * @param address the address of the account
   * @returns the account, or undefined if it doesn't exist
   */
  get(address: string): Promise<WatcherAccount | undefined>
  /**
   * get all accounts stored in this repo
   * @returns array of accounts stored in repo, can be an empty array also
   */
  getAll(): Promise<WatcherAccount[]>
  /**
   * Update a record in the repository
   * @param address address of tracked account to update
   * @param balance new balance
   * @param lastUpdatedRound new updated round
   * @throws Error if account doesn't exist
   * @returns updated WatcherAccount
   */
  update(address: string, balance: bigint, lastUpdatedRound: bigint): Promise<WatcherAccount>
}
