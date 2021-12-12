import { vocationId } from 'Constants'

export const getVocationId = (vocationString: string): number => {
  if (/knight/gi.test(vocationString)) return vocationId.KNIGHT
  if (/paladin/gi.test(vocationString)) return vocationId.PALADIN
  if (/sorcerer/gi.test(vocationString)) return vocationId.SORCERER
  if (/druid/gi.test(vocationString)) return vocationId.DRUID

  return vocationId.NONE
}
