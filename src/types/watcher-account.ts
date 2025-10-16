export interface WatcherAccount {
  // address of the account
  address: string
  // algo balance
  balance: bigint
  // last updated time
  lastUpdatedRound: bigint
}
