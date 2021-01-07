const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('./utils');
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('./config');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const bazaarUrl = 'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades';

var globalDataSize;
var globalIndex = 0;

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

    let allBazaarPrices = [];
    for (let i = 0; i < bazaarPages.length; i++) {
        allBazaarPrices.push(...bazaarPages[i]);
    }

    console.groupEnd();
    console.groupEnd();

    console.log(`${timeStamp('system')} loading AllCharacterData.json ...`);
    var data = await fs.readFile('./AllCharacterData.json', 'utf-8');
    data = JSON.parse(data);

    for(const updatedItem of allBazaarPrices) {
        let indexFromData = getIndexById(updatedItem.id, data);
        if(indexFromData === -1) continue;
        data[indexFromData].currentBid = updatedItem.currentBid;
    }

    await fs.writeFile('LatestCharacterData.json', JSON.stringify(data));
    console.log(`${timeStamp('success')} All character data saved to 'LatestCharacterData.json'`);
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

    let charactersData = [];

    auctions.each((index, element) => {
        const $ = cheerio.load(element);
        const charNameLink = $('.AuctionCharacterName a');
        const charBidAmount = $('.ShortAuctionDataValue b');

        const urlObj = new URL(charNameLink[0].attribs.href);

        const charObject = {
            id: Number(urlObj.searchParams.get('auctionid')),
            currentBid: Number(charBidAmount[0].children[0].data.replace(/,/g, ''))
        }

        charactersData.push(charObject);
    });

    return charactersData;
}

const getIndexById = (id, array) => {
    for (let i = 0; i < array.length; i++) {
        if(array[i].id === id) return i;
    }

    return -1;
}

main();
