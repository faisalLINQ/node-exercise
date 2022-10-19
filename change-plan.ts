import { IPlan } from './plan'

interface IChangePlan {
  previousPlan?: IPlan
  nextPlan: IPlan
  changedOn: number
}

export class ChangePlan {
  public previousPlan?: IPlan
  public nextPlan: IPlan
  public changedOn: number

  constructor (change: IChangePlan) {
    this.previousPlan = change.previousPlan
    this.nextPlan = change.nextPlan
    this.changedOn = change.changedOn
  }
}
