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
    const $ = await fetchFirstPage(bazaarUrl);

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

    let allBazaarPrices = [];
    for (let i = 0; i < bazaarPages.length; i++) {
        allBazaarPrices.push(...bazaarPages[i]);
    }

    console.groupEnd();
    console.groupEnd();

    console.log(`${timeStamp('system')} loading AllCharacterData.json ...`);
    var data = await fs.readFile('./Output/AllCharacterData.json', 'utf-8');
    data = JSON.parse(data);
    const dictionaryData = makeIdDictionary(data);

    let updatedData = [];
    for (const updatedItem of allBazaarPrices) {
        if (!dictionaryData[updatedItem.id]) continue;

        dictionaryData[updatedItem.id].currentBid = updatedItem.currentBid;
        dictionaryData[updatedItem.id].hasBeenBidded = updatedItem.hasBeenBidded;
        updatedData.push(dictionaryData[updatedItem.id]);
    }

    await fs.writeFile('./Output/LatestCharacterData.json', JSON.stringify(updatedData));
    console.log(`${timeStamp('success')} All character data saved to 'LatestCharacterData.json'`);
}

const fetchFirstPage = async (url) => {
    return await maxRetry(async () => {
        return await fetchAndLoad(url);;
    }, MAX_RETRIES);
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
        if (helper.maintenanceCheck()) process.exit();

        charactersData.push({
            id: helper.id(),
            currentBid: helper.currentBid(),
            hasBeenBidded: helper.hasBeenBidded()
        });
    });

    return charactersData;
}

const makeIdDictionary = (array) => {
    const dictionaryObject = {};

    for (const arrayItem of array) {
        dictionaryObject[arrayItem.id] = arrayItem;
    }

    return dictionaryObject;
}

main();
