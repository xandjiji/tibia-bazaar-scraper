import { vocationId } from 'Constants'

const vocationIdToKey = {
  [vocationId.NONE]: 'rooker',
  [vocationId.KNIGHT]: 'knight',
  [vocationId.PALADIN]: 'paladin',
  [vocationId.SORCERER]: 'sorcerer',
  [vocationId.DRUID]: 'druid',
} as const

type VocationCountKey = typeof vocationIdToKey[keyof typeof vocationIdToKey]

const PRECISION = 2
const fixedPercentage = (value: number): number =>
  +(value * 100).toFixed(PRECISION)

export const calculateVocationDistribution = (
  history: PartialCharacterObject[],
): DistributionData => {
  const vocationCount: Record<VocationCountKey, number> = {
    rooker: 0,
    knight: 0,
    paladin: 0,
    sorcerer: 0,
    druid: 0,
  }

  history.forEach(({ vocationId }) => {
    const vocation = vocationIdToKey[vocationId]
    vocationCount[vocation]++
  })

  const totalCount = history.length

  return {
    rooker: fixedPercentage(vocationCount.rooker / totalCount),
    knight: fixedPercentage(vocationCount.knight / totalCount),
    paladin: fixedPercentage(vocationCount.paladin / totalCount),
    sorcerer: fixedPercentage(vocationCount.sorcerer / totalCount),
    druid: fixedPercentage(vocationCount.druid / totalCount),
  }
}
