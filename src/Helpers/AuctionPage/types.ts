import { RequestTypes } from 'utils/fetch/types'

export type CharacterPostData = Pick<
  PartialCharacterObject,
  'outfits' | 'storeOutfits' | 'mounts' | 'storeMounts'
>

export const readableTypes: Record<RequestTypes, string> = {
  items: 'items',
  storeItems: 'store items',
  mounts: 'mounts',
  storeMounts: 'store mounts',
  outfits: 'outfits',
  storeOutfits: 'store outfits',
} as const
