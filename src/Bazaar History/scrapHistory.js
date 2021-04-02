const AuctionPageHelper = require('../Parsers/AuctionPageHelper');
const {
    timeStamp,
    makeRangeArray,
    removeDuplicatesFromArrayByKey,
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
var oldCounter = 0;

var availableUfinishedCounter = 0;

const readableFileName = 'readableBazaarHistory.json';

const main = async () => {
    await loadGlobalVariables();

    if (currentAuctionId <= latestAuctionId) {
        const auctionIdArray = makeRangeArray(currentAuctionId, latestAuctionId);

        console.log(`${timeStamp('highlight')} Scraping every single page:`);
        console.group();
        await promiseAllInBatches(retryWrapper, auctionIdArray, MAX_CONCURRENT_REQUESTS, onEachBatch);
        console.groupEnd();

        currentAuctionId -= MAX_CONCURRENT_REQUESTS;
        await saveCurrentBuffer();
    }

    console.log(`${timeStamp('highlight')} Scraping every single old unfinished auction:`);
    console.group();
    const availableUnfinishedFileBuffer = unfinishedFileBuffer.filter(item => Math.floor(Date.now() / 1000) > item.auctionEnd);
    availableUfinishedCounter = availableUnfinishedFileBuffer.length;
    await promiseAllInBatches(retryOldWrapper, availableUnfinishedFileBuffer, MAX_CONCURRENT_REQUESTS, onEachOldBatch);
    console.groupEnd();

    await saveCurrentBuffer();
}

const retryGetLatestAuctionId = async () => {
    return await maxRetry(async () => {
        return await getLatestAuctionId();
    }, MAX_RETRIES);
}

const getLatestAuctionId = async () => {
    console.log(`${timeStamp('neutral')} getting latest auction ID ...`);

    const $ = await fetchAndLoad('https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&order_column=103&order_direction=0');
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
    console.log(`${timeStamp('system')} loading ${readableFileName} ...`);
    historyFileBuffer = await fs.readFile(`./Output/${readableFileName}`, 'utf-8');
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

const scrapSinglePage = async (id) => {
    const $ = await fetchAndLoad(`https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&page=details&auctionid=${id}&source=overview`);
    helper.setHtml($);

    if (helper.errorCheck()) return;

    if (!helper.isFinished()) {
        unfinishedFileBuffer.push({ id, auctionEnd: helper.auctionEnd() });
        return;
    }

    return helper.charObject();
}

const retryOldWrapper = async (id) => {
    return await maxRetry(async () => {
        return await scrapOldSinglePage(id);
    }, MAX_RETRIES);
}

const scrapOldSinglePage = async (item) => {
    const { id } = item;

    const $ = await fetchAndLoad(`https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades&page=details&auctionid=${id}&source=overview`);
    helper.setHtml($);

    if (helper.errorCheck()) return;

    return helper.charObject();
}

const onEachBatch = async (batchArray) => {
    const newItems = accumulateOnBuffer(batchArray);
    console.log(`${timeStamp('neutral')} accumulating ${counter} items [${currentAuctionId}/${latestAuctionId}]`);

    if (newItems > 0 && counter % 100 === 0) await saveCurrentBuffer();
    currentAuctionId += MAX_CONCURRENT_REQUESTS;

    if (DELAY > 0) await sleep(DELAY);
}

const onEachOldBatch = async (batchArray) => {
    const newItems = accumulateOnBuffer(batchArray);
    oldCounter += MAX_CONCURRENT_REQUESTS;

    if (newItems > 0) console.log(`${timeStamp('neutral')} accumulating ${counter} items from old history [${oldCounter}/${availableUfinishedCounter}] [${unfinishedFileBuffer.length} total]`);
    if (DELAY > 0) await sleep(DELAY);
}

const accumulateOnBuffer = (batchArray) => {
    batchArray = batchArray.filter(item => item);
    historyFileBuffer = [...batchArray, ...historyFileBuffer];
    counter += batchArray.length;

    return batchArray.length;
}

const saveCurrentBuffer = async () => {
    await fs.writeFile(`./Output/${readableFileName}`, JSON.stringify(historyFileBuffer));

    const scrapedIds = historyFileBuffer.map(item => item.id);
    const filteredUnfinishedAuctions = unfinishedFileBuffer.filter(item => !scrapedIds.includes(item.id));
    await fs.writeFile('./Output/scrapHistoryData.json', JSON.stringify({
        lastScrapedId: currentAuctionId,
        unfinishedAuctions: filteredUnfinishedAuctions
    }));
    console.log(`${timeStamp('system')} ${historyFileBuffer.length} items saved to ${readableFileName}`);
    await setupFinalData();
}

const setupFinalData = async () => {
    console.log(`${timeStamp('highlight')} Sorting, filtering and minifying data...`);
    console.groupEnd();
    const filteredData = removeDuplicatesFromArrayByKey('id', historyFileBuffer);

    filteredData.sort((a, b) => {
        return b.auctionEnd - a.auctionEnd;
    });

    await fs.writeFile(`./Output/${readableFileName}`, JSON.stringify(filteredData));
    console.log(`${timeStamp('success')} sorted and filtered data was saved to ${readableFileName}`);

    const minifiedFinalData = filteredData.map(objectToMinified);
    await fs.writeFile('./Output/MinifiedBazaarHistory.json', JSON.stringify(minifiedFinalData));
    console.log(`${timeStamp('success')} minified data was saved to MinifiedBazaarHistory.json`);
}

main();