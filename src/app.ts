import cron from 'node-cron'
// repo
import { MemRepository } from './repositories/mem/watcher-account-repository'
// algorand util funcs
import { getAccountBalance } from './utils/algorand.js'

import * as config from './config'
import { getServer } from './server'

// just create a single instance here, usually this would be placed into another file to create a singleton the rest of app can import
export const watcherAccountRepository = new MemRepository()

// ideally this logic would be abstracted somewhere, but for simplicity it's here.
const syncWatcherAccounts = async () => {
  const watcherAccounts = await watcherAccountRepository.getAll()

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
      const updated = await watcherAccountRepository.update(account.address, newBalance, validAsOfRound)

      console.info(`account: ${account.address} balance: ${currentBalance} changed to ${updated.balance}`)
    }
  })
}

// create job to run once every minute
cron.schedule('* * * * *', async () => {
  console.log('running a task every minute')

  // call func to sync/update all tracked accounts
  await syncWatcherAccounts()
})

// create dummy user to track
//watcherAccountRepository.create('J2PBL4FBEKB7I2QRXYETPLJS24LH336JTJRV2DJ5MJODTM4OIGGXK6H5NY', 500n, 1002n)

const server = getServer()

server.listen({ port: config.port }, (err: Error | null, _address: string) => {
  if (err) {
    server.log.error(err)
    // exit process with non-zero error code
    process.exit(1)
  }
})
