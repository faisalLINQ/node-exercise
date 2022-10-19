import _ from 'lodash'
import moment from 'moment'

import { DataUsage } from './data-usage'
import { IPlan, Plan } from './plan'

export enum STATUS {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

interface IWirelessNumber {
  name: string
  status: STATUS
  dataUsages: DataUsage[]
  plan?: IPlan
}

export class WirelessNumber extends Plan {
  public name: string
  public status: STATUS
  private dataUsages: DataUsage[]

  constructor (wirelessNumber: IWirelessNumber) {
    super(wirelessNumber.plan)

    this.name = wirelessNumber.name
    this.status = wirelessNumber.status
    this.dataUsages = wirelessNumber.dataUsages
  }

  public getLatestDataUsed (cycleStartDay: number): number {
    if (!this.dataUsages.length) return 0

    const cycleStartDate = moment().set({ date: cycleStartDay })
    const currentCycleDataUsages = this.dataUsages.filter(({ usedOn }) => usedOn > cycleStartDate.unix())
    const latestUsage = _.maxBy(currentCycleDataUsages, (({ usedOn }) => usedOn))
    if (!latestUsage) return 0

    return latestUsage.dataUsed
  }
}
