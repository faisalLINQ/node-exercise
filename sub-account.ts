import moment from 'moment'

import { ChangePlan } from './change-plan'
import { DataUsage } from './data-usage'
import { IPlan, Plan } from './plan'
import { WirelessNumber } from './wireless-number'

interface ISubAccount {
  name: string
  wirelessNumbers: WirelessNumber[]
  cycleStartDay: number
  maxCapacity: number
  dataUsages: DataUsage[]
  plan: IPlan
}

export class SubAccount extends Plan {
  public name: string
  public wirelessNumbers: WirelessNumber[]
  public cycleStartDay: number
  public maxCapacity: number

  public changePlanHistory: ChangePlan[]

  constructor (subAccount: ISubAccount) {
    super(subAccount.plan)

    this.name = subAccount.name
    this.wirelessNumbers = subAccount.wirelessNumbers
    this.cycleStartDay = subAccount.cycleStartDay
    this.maxCapacity = subAccount.maxCapacity
    this.changePlanHistory = []

    if (this.wirelessNumbers.length > this.maxCapacity) {
      throw new Error(`Cannot add wireless numbers > ${this.maxCapacity}`)
    }
  }

  public get isHealthy (): boolean {
    if (!this.plan) return true

    return this.latestDataUsage < this.plan.dataTotal
  }

  public get latestDataUsage (): number {
    return this.wirelessNumbers.reduce((sum, wirelessNumber) => {
      return sum + wirelessNumber.getLatestDataUsed(this.cycleStartDay)
    }, 0)
  }

  public getWirelessNumber (wirelessNumber: string): WirelessNumber | undefined {
    return this.wirelessNumbers.find(({ name }) => name === wirelessNumber)
  }

  public removeWirelessNumber (wirelessNumber: string): void {
    this.wirelessNumbers = this.wirelessNumbers.filter(({ name }) => name !== wirelessNumber)
  }

  public changePlan (nextPlan: IPlan): void {
    const changePlan = new ChangePlan({
      changedOn: moment().unix(),
      nextPlan,
      previousPlan: this.plan,
    })

    this.changePlanHistory.push(changePlan)
  }
}
