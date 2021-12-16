import { AuctionPage, PostData } from 'Helpers'
import { retryWrapper, postHtml, logging } from 'utils'
import { PostHtmlProps } from 'utils/fetch/types'
import { CharacterPostData, readableTypes } from './types'

const { broadcast, bumpBroadcast, coloredText } = logging

const logRequest = ({ auctionId, pageIndex, type }: PostHtmlProps): void =>
  bumpBroadcast(
    `Requesting ${coloredText(
      readableTypes[type],
      'control',
    )} data page ${coloredText(
      pageIndex,
      'highlight',
    )} for auction id ${coloredText(auctionId, 'highlight')}`,
    'neutral',
  )

const getPostData = retryWrapper((args: PostHtmlProps) => {
  logRequest(args)
  return postHtml(args)
})

export const getPagedData = async (
  content: string,
): Promise<CharacterPostData> => {
  const helper = new AuctionPage()
  const postHelper = new PostData()

  const auctionId = helper.id(content)

  const outfitLastIndex = helper.boxSectionLastIndex('Outfits', content)
  const sOutfitLastIndex = helper.boxSectionLastIndex('StoreOutfits', content)
  const mountsLastIndex = helper.boxSectionLastIndex('Mounts', content)
  const sMountsLastIndex = helper.boxSectionLastIndex('StoreMounts', content)

  let outfits: Outfit[] = helper.outfitFirstPage(content)
  for (let pageIndex = 2; pageIndex <= outfitLastIndex; pageIndex++) {
    const html = await getPostData({
      auctionId,
      pageIndex,
      type: 'outfits',
    })
    outfits = [...outfits, ...postHelper.outfits(html)]
  }

  let storeOutfits: Outfit[] = helper.storeOutfitFirstPage(content)
  for (let pageIndex = 2; pageIndex <= sOutfitLastIndex; pageIndex++) {
    const html = await getPostData({
      auctionId,
      pageIndex,
      type: 'storeOutfits',
    })
    storeOutfits = [...storeOutfits, ...postHelper.outfits(html)]
  }

  let mounts: string[] = helper.mountFirstPage(content)
  for (let pageIndex = 2; pageIndex <= mountsLastIndex; pageIndex++) {
    const html = await getPostData({
      auctionId,
      pageIndex,
      type: 'mounts',
    })
    mounts = [...mounts, ...postHelper.mounts(html)]
  }

  let storeMounts: string[] = helper.storeMountFirstPage(content)
  for (let pageIndex = 2; pageIndex <= sMountsLastIndex; pageIndex++) {
    const html = await getPostData({
      auctionId,
      pageIndex,
      type: 'storeMounts',
    })
    storeMounts = [...storeMounts, ...postHelper.mounts(html)]
  }

  return {
    outfits,
    storeOutfits,
    mounts,
    storeMounts,
  }
}
