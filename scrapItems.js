const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('./utils');
const { dictionary } = require('./dataDictionary');
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('./config');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const { log } = require('console');

const bazaarUrl = 'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades';

/*
    &searchstring=Cobra
    &searchtype=2
    &currentpage=1
*/

const itemList = ['Dwarven Shield', 'Cobra Axe', 'Cobra Sword', 'Cobra Club', 'Cobra Rod', 'Cobra Boots', 'Falcon Sword', 'Falcon Mace', 'Falcon Greaves'];
var itemListObject = {}
for (const item of itemList) {
    itemListObject[item] = [];
}

const main = async () => {

    let allUrls = await promiseAllInBatches(retryScrapItemUrls, itemList, MAX_CONCURRENT_REQUESTS);

    allUrls = allUrls.flat();
    allUrls = allUrls.filter(item => item);

    console.log(`${timeStamp('system')} Scraping all item urls [${allUrls.length} pages]...`);
    await promiseAllInBatches(retryScrapItemIds, allUrls, MAX_CONCURRENT_REQUESTS);

    console.log(itemListObject);
}

const retryScrapItemUrls = async (itemName) => {
    return await maxRetry(async () => {
        return await scrapItemUrls(itemName);
    }, MAX_RETRIES);
}

const scrapItemUrls = async (itemName) => {
    console.log(`${timeStamp('system')} Loading ${itemName}'s first page...`);

    const encodedURI = encodeURI(`${bazaarUrl}&searchstring=${itemName}&searchtype=2&currentpage=`)
    const $ = await fetchAndLoad(`${encodedURI}`);

    const lastPageElement = $('.PageNavigation .PageLink:last-child a');
    if (!lastPageElement[0]) return;

    const href = new URL(lastPageElement[0].attribs.href);
    const lastPageIndex = Number(href.searchParams.get('currentpage'));

    const itemPagesUrl = [];
    for (let i = 1; i <= lastPageIndex; i++) {
        itemPagesUrl.push({
            itemName,
            url: `${encodedURI}${i}`
        })
    }

    return itemPagesUrl;
}

const retryScrapItemIds = async (itemObj) => {
    return await maxRetry(async () => {
        return await scrapItemIds(itemObj);
    }, MAX_RETRIES);
}

const scrapItemIds = async (itemObj) => {
    const $ = await fetchAndLoad(`${itemObj.url}`);

    const auctions = $('.Auction');

    auctions.each((index, element) => {
        const $ = cheerio.load(element);
        const charNameLink = $('.AuctionCharacterName a');
        const urlObj = new URL(charNameLink[0].attribs.href);

        itemListObject[itemObj.itemName].push(Number(urlObj.searchParams.get('auctionid')));
    });
}

main();