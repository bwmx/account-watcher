import cron from 'node-cron'
// repo
import { MemRepository } from './repositories/mem/watcher-account-repository'

import * as config from './config'
import { getServer } from './server'
import { syncWatcherAccounts } from './tasks'

// just create a single instance here, usually this would be placed into another file to create a singleton the rest of app can import
export const watcherAccountRepository = new MemRepository()

// create job to run once every minute
cron.schedule('* * * * *', async () => {
  console.log('running a task every minute')

  // call func to sync/update all tracked accounts
  await syncWatcherAccounts(watcherAccountRepository)
})

const server = getServer()

server.listen({ port: config.port }, (err: Error | null, _address: string) => {
  if (err) {
    server.log.error(err)
    // exit process with non-zero error code
    process.exit(1)
  }
})
