import moment from 'moment'

import { Account } from "."
import { SubAccount } from "./sub-account"
import { STATUS, WirelessNumber } from "./wireless-number"

function getAccount() {
  return new Account({
    name: 'Shade Construction',
    subAccounts: [
      new SubAccount({
        name: '123456-123',
        cycleStartDay: 1,
        dataUsages: [],
        maxCapacity: 25,
        plan: {
          name: '25GB',
          dataTotal: 25,
          isUnlimited: false,
          price: 100
        },
        wirelessNumbers: [
          new WirelessNumber({
            name: '111-111-1111',
            dataUsages: [{
              dataUsed: 30,
              usedOn: moment('2022-10-10').unix()
            }, {
              dataUsed: 40,
              usedOn: moment('2022-10-11').unix()
            }],
            status: STATUS.ACTIVE,
          })
        ],
      }),
      new SubAccount({
        name: '123456-234',
        cycleStartDay: 1,
        dataUsages: [],
        maxCapacity: 25,
        plan: {
          name: '25GB',
          dataTotal: 25,
          isUnlimited: false,
          price: 100
        },
        wirelessNumbers: [],
      })
    ]
  })
}

describe('exercise', () => {
  test('should get unhealthy sub accounts', () => {
    expect(getAccount().getUnHealthySubAccounts()).toEqual(['123456-123'])
  })

  test('should be able to transfer wireless number from one subaccount to another subaccount', () => {
    const account = getAccount()
    expect(account.transferWirelessNumber('111-111-1111', '123456-234')).toBeUndefined()

    expect(account.subAccounts[0].getWirelessNumber('111-111-1111')).not.toBeDefined()
    expect(account.subAccounts[1].getWirelessNumber('111-111-1111')).toBeDefined()

    expect(account.getUnHealthySubAccounts()).not.toContain('123456-123')
  })

  test('should be able to change the sub account plan', () => {
    const account = getAccount()
    account.subAccounts[0].changePlan({
      name: '35GB',
      dataTotal: 35,
      isUnlimited: false,
      price: 200,
    })
    const changedTime = moment().unix()
    expect(account.subAccounts[0].changePlanHistory).toEqual([
      {
        previousPlan: { name: '25GB', dataTotal: 25, isUnlimited: false, price: 100 },
        nextPlan: { name: '35GB', dataTotal: 35, isUnlimited: false, price: 200 },
        changedOn: changedTime
      }
    ])
  })

  test('should get monthly account data usage', () => {
    const account = getAccount()
    expect(account.getMonthlyDataUsage()).toEqual(40)
  })
})