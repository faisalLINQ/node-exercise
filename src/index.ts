import { SubAccount } from './sub-account'

interface IAccount {
  name: string
  subAccounts: SubAccount[]
}

export class Account {
  public name: string
  public subAccounts: SubAccount[]
  
  constructor (account: IAccount) {
    this.name = account.name
    this.subAccounts = account.subAccounts
  }

  public transferWirelessNumber (wirelessNumber: string, nextSubAccount: string): void {
    const currentSubAccount = this.subAccounts.find((subAccount) => subAccount.getWirelessNumber(wirelessNumber))
    if (!currentSubAccount) throw new Error(`Wireless number ${wirelessNumber} do not exists`)

    const wirelessNumberObject = currentSubAccount.getWirelessNumber(wirelessNumber)
    if (!wirelessNumberObject) throw new Error(`Wireless number ${wirelessNumber} do not exists`)

    const nextSubAccountObject = this.subAccounts.find(({ name }) => name === nextSubAccount)
    if (!nextSubAccountObject) throw new Error(`Target sub account ${nextSubAccount} do not exists`)

    currentSubAccount.removeWirelessNumber(wirelessNumber)
    nextSubAccountObject.wirelessNumbers.push(wirelessNumberObject)
  }

  public getUnHealthySubAccounts (): string[] {
    return this.subAccounts.filter(({ isHealthy }) => !isHealthy).map(({ name }) => name)
  }

  public getMonthlyDataUsage (): number {
    return this.subAccounts.reduce((sum, subAccount) => {
      return sum + subAccount.latestDataUsage
    }, 0)
  }
}
