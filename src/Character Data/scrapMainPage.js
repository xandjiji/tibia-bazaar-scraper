const ListPageHelper = require('../Parsers/ListPageHelper');
const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('../utils');
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('../config');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const bazaarUrl = 'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades';

var globalDataSize;
var globalIndex = 0;

const helper = new ListPageHelper();

const main = async () => {
    console.log(`${timeStamp('system')} Loading first page...`);
    console.group();
    const $ = await fetchAndLoad(bazaarUrl);

    const lastPageElement = $('.PageNavigation .PageLink:last-child a');
    const href = new URL(lastPageElement[0].attribs.href);
    const lastPageIndex = Number(href.searchParams.get('currentpage'));

    globalDataSize = lastPageIndex;

    let bazaarPages = [];
    for (let i = 1; i <= lastPageIndex; i++) {
        bazaarPages.push(`${bazaarUrl}&currentpage=${i}`);
    }

    console.log(`${timeStamp('highlight')} Scraping every Bazaar page:`);
    console.group();

    bazaarPages = await promiseAllInBatches(retryWrapper, bazaarPages, MAX_CONCURRENT_REQUESTS);

    let allBazaarCharacters = [];
    for (let i = 0; i < bazaarPages.length; i++) {
        allBazaarCharacters.push(...bazaarPages[i]);
    }

    console.groupEnd();
    console.groupEnd();

    await fs.writeFile('./Output/bazaarPages.json', JSON.stringify(allBazaarCharacters));
    console.log(`${timeStamp('success')} All character data saved to 'bazaarPages.json'`);
}

const retryWrapper = async (url) => {
    return await maxRetry(async () => {
        return await scrapBazaarPage(url);
    }, MAX_RETRIES);
}

const scrapBazaarPage = async (url) => {
    const $ = await fetchAndLoad(url);
    globalIndex++;
    console.log(`${timeStamp('neutral')} Scraping Bazaar page [${globalIndex}/${globalDataSize}]`);

    const auctions = $('.Auction');

    const charactersData = [];
    auctions.each((index, element) => {

        helper.setHtml(cheerio.load(element));

        charactersData.push({
            id: helper.id(),
            nickname: helper.nickname(),
            auctionEnd: helper.auctionEnd(),
            currentBid: helper.currentBid(),
            hasBeenBidded: helper.hasBeenBidded()
        });
    });

    return charactersData;
}

main();
