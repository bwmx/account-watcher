import { IWatcherAccountRepository } from './repositories/interface-type'
import { getAccountBalance } from './utils/algorand'

// generic tasks that the cronjob will call/complete
export const syncWatcherAccounts = async (repo: IWatcherAccountRepository) => {
  const watcherAccounts = await repo.getAll()

  console.log('watcherAccount: ', watcherAccounts)

  watcherAccounts.forEach(async (account) => {
    const currentBalance = account.balance
    const { balance: newBalance, validAsOfRound } = await getAccountBalance(account.address)

    // check if there has been any change
    if (newBalance === currentBalance) {
      // nothing happened
      // don't update `lastUpdatedRound` because nothing happened
      console.info(`account: ${account.address} balance: ${currentBalance} didn't change`)
      return
    } else {
      // update the state of the record with the new balance
      const updated = await repo.update(account.address, newBalance, validAsOfRound)

      console.info(`account: ${account.address} balance: ${currentBalance} changed to ${updated.balance}`)
    }
  })
}
