export type PatchableData = Omit<
  StatisticsData,
  'totalRevenue' | 'totalTibiaCoins'
>

export type AppendableDataKey = keyof Pick<
  StatisticsData,
  'totalRevenue' | 'totalTibiaCoins'
>
