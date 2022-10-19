export interface IPlan {
  name: string
  price: number
  isUnlimited: boolean
  dataTotal: number
}

export class Plan {
  constructor (protected plan?: IPlan) { }
}
