interface IDataUsage {
  dataUsed: number
  usedOn: number
}

export class DataUsage {
  public dataUsed: number
  public usedOn: number

  constructor (dataUsage: IDataUsage) {
    this.dataUsed = dataUsage.dataUsed
    this.usedOn = dataUsage.usedOn
  }
}
