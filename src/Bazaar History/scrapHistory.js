const AuctionPageHelper = require('../Parsers/AuctionPageHelper');
const {
    timeStamp,
    makeRangeArray,
    fetchAndLoad,
    promiseAllInBatches,
    maxRetry,
    sleep
} = require('../utils');
const { objectToMinified } = require('../dataDictionary');
const { MAX_CONCURRENT_REQUESTS, DELAY, MAX_RETRIES } = require('../config');
const fs = require('fs').promises;

const helper = new AuctionPageHelper();

var latestAuctionId;
var currentAuctionId;

var historyFileBuffer;
var unfinishedFileBuffer;

var counter = 0;

const main = async () => {
    await loadGlobalVariables();

    if (currentAuctionId > latestAuctionId) {
        console.log(`${timeStamp('fail')} [Latest Auction ID] is less than [Current Auction ID]`);
        return;
    }

    const auctionIdArray = makeRangeArray(currentAuctionId, latestAuctionId);

    console.log(`${timeStamp('highlight')} Scraping every single page:`);
    console.group();
    await promiseAllInBatches(retryWrapper, auctionIdArray, MAX_CONCURRENT_REQUESTS, onEachBatch);
    console.groupEnd();

    console.log(`${timeStamp('highlight')} Scraping every single old unfinished auction:`);
    console.group();
    await promiseAllInBatches(retryWrapper, unfinishedFileBuffer, MAX_CONCURRENT_REQUESTS, onEachUnfinishedAuctionsBatch);
    console.groupEnd();

    await setupFinalData();
}

const setupFinalData = async () => {
    console.log(`${timeStamp('highlight')} Sorting, filtering and minifying data...`);
    console.groupEnd();
    const uniqueCharacterArray = removeDuplicatesFromArrayByKey('id', historyFileBuffer);

    uniqueCharacterArray.sort((a, b) => {
        return b.auctionEnd - a.auctionEnd;
    });

    const minifiedFinalData = uniqueCharacterArray.map(objectToMinified);

    await fs.writeFile('./Output/MinifiedBazaarHistory.json', JSON.stringify(minifiedFinalData));
    console.log(`${timeStamp('success')} minified data was saved to MinifiedBazaarHistory.json`);
}

const removeDuplicatesFromArrayByKey = (key, array) => {
    const addedSet = new Set([]);
    const newUniqueArray = [];
    for (let i = 0; i < array.length; i++) {

        const currentKey = array[i][key];

        if (!addedSet.has(currentKey)) {
            addedSet.add(currentKey);
            newUniqueArray.push(array[i]);
        }
    }

    return newUniqueArray;
}

const retryGetLatestAuctionId = async () => {
    return await maxRetry(async () => {
        return await getLatestAuctionId();
    }, MAX_RETRIES);
}

const getLatestAuctionId = async () => {
    console.log(`${timeStamp('neutral')} getting latest auction ID ...`);

    const $ = await fetchAndLoad('https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades');
    const latestAuctionLink = $('.AuctionCharacterName a');

    const latestIdArray = [];
    latestAuctionLink.each((index, element) => {
        const href = new URL(element.attribs.href);
        latestIdArray.push(Number(href.searchParams.get('auctionid')));
    });
    latestIdArray.sort();

    return latestIdArray[latestIdArray.length - 1];
}

const loadGlobalVariables = async () => {
    console.log(`${timeStamp('system')} loading readableBazaarHistory.json ...`);
    historyFileBuffer = await fs.readFile('./Output/readableBazaarHistory4.json', 'utf-8');
    historyFileBuffer = JSON.parse(historyFileBuffer);

    console.log(`${timeStamp('system')} loading scrapHistoryData.json ...`);
    let scrapHistoryData = await fs.readFile('./Output/scrapHistoryData.json', 'utf-8');
    scrapHistoryData = JSON.parse(scrapHistoryData);

    const { lastScrapedId, unfinishedAuctions } = scrapHistoryData;
    currentAuctionId = lastScrapedId + 1;
    unfinishedFileBuffer = [...unfinishedAuctions];

    await helper.init();

    latestAuctionId = await retryGetLatestAuctionId();
}

const retryWrapper = async (id) => {
    return await maxRetry(async () => {
        return await scrapSinglePage(id);
    }, MAX_RETRIES);
}

const onEachBatch = async (batchArray) => {
    batchArray = batchArray.filter(item => item);
    historyFileBuffer = [...batchArray, ...historyFileBuffer];

    counter += batchArray.length;
    if (counter >= 100) {
        await fs.writeFile('./Output/readableBazaarHistory4.json', JSON.stringify(historyFileBuffer));
        await fs.writeFile('./Output/scrapHistoryData.json', JSON.stringify({
            lastScrapedId: currentAuctionId,
            unfinishedAuctions: unfinishedFileBuffer
        }));
        console.log(`${timeStamp('system')} ${counter} new items appended to readableBazaarHistory.json [${currentAuctionId}/${latestAuctionId}]`);

        counter = 0;
    } else {
        console.log(`${timeStamp('neutral')} accumulating ${counter} items [${currentAuctionId}/${latestAuctionId}]`);
    }

    currentAuctionId += MAX_CONCURRENT_REQUESTS;

    if (DELAY > 0) await sleep(DELAY);
}

const onEachUnfinishedAuctionsBatch = async (batchArray) => {
    batchArray = batchArray.filter(item => item);
    historyFileBuffer = [...batchArray, ...historyFileBuffer];
    await fs.writeFile('./Output/readableBazaarHistory4.json', JSON.stringify(historyFileBuffer));

    let scrapHistoryData = await fs.readFile('./Output/scrapHistoryData.json', 'utf-8');
    scrapHistoryData = JSON.parse(scrapHistoryData);
    const { lastScrapedId, unfinishedAuctions } = scrapHistoryData;
    const recentAddedFinished = batchArray.map(item => item.id);

    const filteredUnfinishedAuctions = unfinishedAuctions.filter(id => !recentAddedFinished.includes(id));
    await fs.writeFile('./Output/scrapHistoryData.json', JSON.stringify({
        lastScrapedId: lastScrapedId,
        unfinishedAuctions: filteredUnfinishedAuctions
    }));

    console.log(`${timeStamp('system')} ${batchArray.length} old unfinished items appended to readableBazaarHistory.json`);

    if (DELAY > 0) await sleep(DELAY);
}

const scrapSinglePage = async (id) => {
    const $ = await fetchAndLoad(`https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&page=details&auctionid=${id}&source=overview`);
    helper.setHtml($);

    if(helper.errorCheck()) return;

    if (!helper.isFinished()) {
        if (!unfinishedFileBuffer.includes(id)) unfinishedFileBuffer.push(id);
        return;
    }

    return helper.charObject();
}

main();