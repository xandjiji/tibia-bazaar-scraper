const PostDataHelper = require('../Parsers/PostDataHelper');
const { postAndLoad, maxRetry, timeStamp } = require('../utils');
const { MAX_RETRIES } = require('../config');

const dataHelper = new PostDataHelper();

const scrapData = async ({ id, type, method, pageIndex }) => {
    console.log(`${timeStamp('neutral')} Scraping ${dataHelper.readableTypes[type]} [${pageIndex}]`);
    const $ = await postAndLoad(id, type, pageIndex)
    dataHelper.setHtml($)
    return dataHelper[method]()
}

const scrapPaginatedData = async (args) => {
    return await maxRetry(async () => {
        return await scrapData(args);
    }, MAX_RETRIES);
}

module.exports = { scrapPaginatedData }
