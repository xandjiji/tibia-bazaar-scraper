export type PatchableData = Omit<
  StatisticsData,
  'totalRevenue' | 'totalTibiaCoins'
>
