const PostDataHelper = require('../Parsers/PostDataHelper');
const { scrapPaginatedData } = require('./scrapPaginatedData')
const { promiseAllInBatches } = require('../utils');
const { MAX_CONCURRENT_REQUESTS } = require('../config');

const scrapMountsAndOutfits = async (pageHelper) => {
    const postHelper = new PostDataHelper()

    console.group();
    const id = pageHelper.id()

    const paginatedOutfits = await promiseAllInBatches(
        scrapPaginatedData,
        buildRequestQueue(
            pageHelper.lastPageIndex('Outfits'),
            {
                id,
                type: postHelper.types.outfits,
                method: 'outfits'
            }
        ),
        MAX_CONCURRENT_REQUESTS
    )
    const outfits = [
        ...pageHelper.outfits(),
        ...paginatedOutfits.flat()
    ]

    const paginatedStoreOutfits = await promiseAllInBatches(
        scrapPaginatedData,
        buildRequestQueue(
            pageHelper.lastPageIndex('StoreOutfits'),
            {
                id,
                type: postHelper.types.storeOutfits,
                method: 'outfits'
            }
        ),
        MAX_CONCURRENT_REQUESTS
    )
    const storeOutfits = [
        ...pageHelper.storeOutfits(),
        ...paginatedStoreOutfits.flat()
    ]

    const paginatedMounts = await promiseAllInBatches(
        scrapPaginatedData,
        buildRequestQueue(
            pageHelper.lastPageIndex('Mounts'),
            {
                id,
                type: postHelper.types.mounts,
                method: 'mounts'
            }
        ),
        MAX_CONCURRENT_REQUESTS
    )
    const mounts = [
        ...pageHelper.mounts(),
        ...paginatedMounts.flat()
    ]

    const paginatedStoreMounts = await promiseAllInBatches(
        scrapPaginatedData,
        buildRequestQueue(
            pageHelper.lastPageIndex('StoreMounts'),
            {
                id,
                type: postHelper.types.storeMounts,
                method: 'mounts'
            }
        ),
        MAX_CONCURRENT_REQUESTS
    )
    const storeMounts = [
        ...pageHelper.storeMounts(),
        ...paginatedStoreMounts.flat()
    ]

    console.groupEnd();

    return {
        outfits,
        storeOutfits,
        mounts,
        storeMounts
    }
}

const buildRequestQueue = (maxPage, args) => {
    const queue = []
    for (let pageIndex = maxPage; pageIndex > 1; pageIndex--) {
        queue.push({ ...args, pageIndex })
    }
    queue.reverse()
    return queue
}

module.exports = { scrapMountsAndOutfits }
