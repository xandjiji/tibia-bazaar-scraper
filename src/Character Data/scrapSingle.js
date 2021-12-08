const AuctionPageHelper = require('../Parsers/AuctionPageHelper');
const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('../utils');
const { scrapMountsAndOutfits } = require('../PostData')
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('../config');
const fs = require('fs').promises;

var globalDataSize;
var globalIndex = 0;
var serverListData = {}
var latestData = []

const main = async () => {
    console.log(`${timeStamp('system')} loading bazaarPages.json ...`);
    var data = await fs.readFile('./Output/bazaarPages.json', 'utf-8');
    data = JSON.parse(data);

    console.log(`${timeStamp('system')} Loading 'LatestCharacterData.json'...`);
    try {
        let previousData = await fs.readFile('./Output/LatestCharacterData.json', 'utf-8');
        previousData = JSON.parse(previousData);
        previousData.forEach((auction) => latestData.push(auction))
    } catch {
        latestData = []
    }

    data = data.filter(({ id }) => !latestData.some((previousAuction) => previousAuction.id === id))

    console.log(`${timeStamp('system')} loading ServerData.json ...`);
    serverListData = await fs.readFile('./Output/ServerData.json', 'utf-8');
    serverListData = JSON.parse(serverListData)

    /* data = data.slice(0, 20); */

    globalDataSize = data.length;

    console.log(`${timeStamp('highlight')} Scraping every single page:`);
    console.group();

    let newSingleData = await promiseAllInBatches(retryWrapper, data, MAX_CONCURRENT_REQUESTS);

    console.groupEnd();
    console.groupEnd();

    newSingleData = newSingleData.filter(element => element != null);

    let fullData = [...latestData, ...newSingleData]
    sortedData = fullData.sort((a, b) => a.auctionEnd - b.auctionEnd)

    await fs.writeFile('./Output/AllCharacterData.json', JSON.stringify(sortedData));
    console.log(`${timeStamp('success')} All single data saved to 'AllCharacterData.json'`);
}

const retryWrapper = async (url) => {
    return await maxRetry(async () => {
        return await scrapSinglePage(url);
    }, MAX_RETRIES);
}

const scrapSinglePage = async (charObject) => {
    const id = charObject.id;
    const nickname = charObject.nickname;

    const $ = await fetchAndLoad(`https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${id}&source=overview`);
    globalIndex++;
    console.log(`${timeStamp('neutral')} Scraping ${nickname}'s single page [${globalIndex}/${globalDataSize}]`);

    const helper = new AuctionPageHelper();
    helper.init(serverListData);
    helper.setHtml($);
    if (helper.maintenanceCheck()) process.exit();

    const mountsAndOutfits = await scrapMountsAndOutfits(helper)

    return {
        ...helper.charObject(),
        ...charObject,
        ...mountsAndOutfits
    };
}

main();