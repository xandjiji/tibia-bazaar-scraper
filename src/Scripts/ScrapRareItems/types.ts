export type RareItem = string

export type RareItemBlock = {
  name: RareItem
  lastPageIndex: number
  ids: number[]
}

export type RareItemBlockCollection = Record<RareItem, RareItemBlock>
