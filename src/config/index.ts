import * as algokit from '@algorandfoundation/algokit-utils'

// create algorand client using env variables that we can use throughout the application
export const algorand = algokit.AlgorandClient.fromEnvironment()

// the port the server will listen on
export const port = parseInt(process.env['PORT']!)
