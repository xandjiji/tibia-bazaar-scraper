const AuctionPageHelper = require('../Parsers/AuctionPageHelper');
const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('../utils');
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('../config');
const fs = require('fs').promises;

var globalDataSize;
var globalIndex = 0;

const helper = new AuctionPageHelper();

const main = async () => {
    console.log(`${timeStamp('system')} loading bazaarPages.json ...`);
    var data = await fs.readFile('./Output/bazaarPages.json', 'utf-8');
    data = JSON.parse(data);

    await helper.init();

    /* data = data.slice(0, 20); */

    globalDataSize = data.length;

    console.log(`${timeStamp('highlight')} Scraping every single page:`);
    console.group();

    let allSingleData = await promiseAllInBatches(retryWrapper, data, MAX_CONCURRENT_REQUESTS);

    console.groupEnd();
    console.groupEnd();

    allSingleData = allSingleData.filter(element => element != null);

    await fs.writeFile('./Output/AllCharacterData.json', JSON.stringify(allSingleData));
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

    helper.setHtml($);
    if (helper.maintenanceCheck()) process.exit();

    return {
        ...charObject,
        outfitId: helper.outfitId(),
        serverId: helper.serverId(),
        vocationId: helper.vocationId(),
        level: helper.level(),
        skills: helper.skills(),
        items: helper.items(),
        charms: helper.charms(),
        transfer: helper.transfer(),
        imbuements: helper.imbuements(),
        hasSoulwar: helper.hasSoulwar()
    };
}

main();