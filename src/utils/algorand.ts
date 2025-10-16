import { algorand } from '../config'

// could place some other convenient wrappers/routes over common algorand functions here

// high level wrapper of https://app.swaggerhub.com/apis/algonode/algod-rest_api/0.0.1#/public/AccountInformation
export const getAccountBalance = async (address: string): Promise<{ balance: bigint; validAsOfRound: bigint }> => {
  const { balance, validAsOfRound } = await algorand.account.getInformation(address)

  return {
    balance: balance.microAlgo,
    validAsOfRound,
  }
}
