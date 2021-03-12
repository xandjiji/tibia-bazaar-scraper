const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('./utils');
const { powerfulToReadable } = require('./dataDictionary');
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('./config');
const cheerio = require('cheerio');
const fs = require('fs').promises;

var serverData;
var latestAuctionId;
var currentAuctionId;

const main = async () => {

    latestAuctionId = await getLatestAuctionId();
    currentAuctionId = await getLastScrapedId();
    serverData = await loadServerData();

    const auctionIdArray = makeRangeArray(currentAuctionId, latestAuctionId);

    console.log(`${timeStamp('highlight')} Scraping every single page:`);
    console.group();

    await promiseAllInBatches(retryWrapper, auctionIdArray, MAX_CONCURRENT_REQUESTS, onEachBatch);

    /*
    console.log(`${timeStamp('system')} loading ServerData.json ...`);
    console.group();
    var serverListData = await fs.readFile('./ServerData.json', 'utf-8');
    serverData = JSON.parse(serverListData);

    globalDataSize = data.length;

    console.log(`${timeStamp('highlight')} Scraping every single page:`);
    console.group();

    let allSingleData = await promiseAllInBatches(retryWrapper, data, MAX_CONCURRENT_REQUESTS);

    console.groupEnd();
    console.groupEnd();

    allSingleData = allSingleData.filter(element => element != null);

    await fs.writeFile('AllCharacterData.json', JSON.stringify(allSingleData));
    console.log(`${timeStamp('success')} All single data saved to 'AllCharacterData.json'`); */
}

const getLatestAuctionId = async () => {
    console.log(`${timeStamp('neutral')} getting latest auction ID ...`);

    const $ = await fetchAndLoad('https://www.tibia.com/charactertrade/?subtopic=pastcharactertrades');
    const latestAuctionLink = $('.AuctionCharacterName a');
    const href = new URL(latestAuctionLink[0].attribs.href);
    return Number(href.searchParams.get('auctionid'));
}

const getLastScrapedId = async () => {
    console.log(`${timeStamp('system')} loading scrapHistoryData.json ...`);

    var scrapHistoryData = await fs.readFile('./scrapHistoryData.json', 'utf-8');
    scrapHistoryData = JSON.parse(scrapHistoryData);

    return scrapHistoryData.lastScrapedId;
}

const makeRangeArray = (start, end) => {
    const array = [];
    for (let i = start; i <= end; i++) {
        array.push(i);
    }
    return array;
}

const retryWrapper = async (id) => {
    return await maxRetry(async () => {
        return await scrapSinglePage(id);
    }, MAX_RETRIES);
}

const onEachBatch = async (batchArray) => {
    batchArray = batchArray.filter(item => item);

    /* append to readableBazarHistory.json */
    /* update scrapHistoryData.json with last item auctionId*/

    console.log(`${timeStamp('highlight')} successfully scraped and saved ${batchArray.length} auctions`);

    console.log(batchArray);
}

const loadServerData = async () => {
    console.log(`${timeStamp('system')} loading ServerData.json ...`);
    console.group();
    var serverListData = await fs.readFile('./ServerData.json', 'utf-8');
    return JSON.parse(serverListData);
}

const scrapSinglePage = async (id) => {
    try {
        id = 4; /* REMOVERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR */
        console.log(`${timeStamp('neutral')} Scraping single page [${id}/${latestAuctionId}]`);
        const $ = await fetchAndLoad(`https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${id}&source=overview`);

        /*
        SCRAP
            HASBEENBIDDED

            NEW DATA
        */

        const nickname = $('.Auction .AuctionCharacterName').text();

        let auctionEnd = $('.ShortAuctionDataValue');
        auctionEnd = dateParsing(auctionEnd[1].children[0].data);

        let currentBid = $('.ShortAuctionDataValue b').text();
        currentBid = Number(currentBid.replace(/,/g, ''));
        console.log(currentBid);
        console.log(888888888888);

        const serverElement = $('.AuctionHeader a');

        const headerElement = $('.AuctionHeader');
        let headerData = headerElement[0].children[2].data.split('|');
        headerData = headerData.map(string => string.trim());

        const featuredItems = $('.AuctionItemsViewBox');
        let featuredItemsArray = featuredItems[0].children.map(scrapItems);
        featuredItemsArray = popNull(featuredItemsArray);

        const characterlevel = Number(headerData[0].replace(/level: /gi, ''));

        const vocationString = headerData[1].replace(/vocation: /gi, '');
        const vocationId = getVocationId(vocationString);

        const outfitElement = $('.AuctionOutfitImage');
        const outfitId = outfitElement[0].attribs.src.split('/').pop();

        const tableContent = $('.TableContent tbody');
        tableContent[2].children.pop();
        const skillsData = tableContent[2].children.map(scrapSkill);

        tableContent[20].children.shift();
        tableContent[20].children.pop();
        let charmsData = tableContent[20].children.map(scrapCharms);
        charmsData = popNull(charmsData);

        const transferText = tableContent[4].children[0].children[0].children[1].children[0].data;
        let transferAvailability = false;
        if (transferText === 'can be purchased and used immediately') {
            transferAvailability = true;
        }

        tableContent[19].children.shift();
        tableContent[19].children.pop();
        let imbuementsData = tableContent[19].children.map(scrapImbuements);
        if (!imbuementsData[imbuementsData.length - 1]) {
            imbuementsData.pop();
        }
        imbuementsData = imbuementsData.sort();


        let hasSoulwar = false;
        if (characterlevel >= 400) {
            hasSoulwar = searchSoulwar(tableContent[15].children[0].children[0].children[0].children[1].children);
        }

        let newCharObject = {
            id,
            nickname,
            auctionEnd,
            currentBid,
            outfitId: outfitId.slice(0, -4),
            serverId: getServerId(serverElement[0].children[0].data),
            vocationId: vocationId,
            level: characterlevel,
            skills: {
                magic: skillsData[5],
                club: skillsData[1],
                fist: skillsData[4],
                sword: skillsData[7],
                fishing: skillsData[3],
                axe: skillsData[0],
                distance: skillsData[2],
                shielding: skillsData[6]
            },
            items: featuredItemsArray,
            charms: charmsData,
            transfer: transferAvailability,
            imbuements: imbuementsData,
            hasSoulwar: hasSoulwar
        };

        return newCharObject;
    } catch (error) {
        return;
    }
}

const getServerId = (serverString) => {
    if (serverData[serverString]) {
        return serverData[serverString].serverId;
    } else {
        return -1;
    }
}

const getVocationId = (vocationString) => {
    if (/knight/gi.test(vocationString)) return 1;
    if (/paladin/gi.test(vocationString)) return 2;
    if (/sorcerer/gi.test(vocationString)) return 3;
    if (/druid/gi.test(vocationString)) return 4;

    return 0;
}

const scrapSkill = (element) => {
    let level = Number(cheerio('.LevelColumn', element).text());
    let percentage = cheerio('.PercentageColumn', element).text();
    percentage = parseFloat(percentage.slice(0, -2));
    percentage = Math.round(percentage);

    return Number(`${level}.${percentage}`);
}

const scrapItems = (element) => {
    const itemTitle = element.attribs.title.split('"');
    if (!itemTitle) return;
    if (itemTitle[0] === '(no item for display selected)') return;

    const itemSrc = element.children[0].attribs.src.split('/').pop();
    return Number(itemSrc.slice(0, -4));
}

const scrapImbuements = (element) => {
    const imbuementText = cheerio('tr:not(.IndicateMoreEntries) td', element).text()
    return powerfulToReadable[imbuementText];
}

const scrapCharms = (element) => {
    const charmString = cheerio('tr:not(.IndicateMoreEntries) td:last-child', element).text();

    return charmString;
}

const searchSoulwar = (elementArray) => {
    for (let i = elementArray.length - 1; i >= 0; i--) {
        const outfitText = elementArray[i].attribs.title;
        if (/Revenant/.test(outfitText)) return true;
    }
    return false;
}

const popNull = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === undefined || array[i] === '') {
            array.pop()
        } else {
            break;
        }
    }

    return array;
}

const dateParsing = (dateString) => {
    
    dateString = dateString.split(',');
    dateString = [...dateString[0].split(' '), ...dateString[1].split(' ')];

    console.log(dateString);

    const month = dateString[0];
    const day = dateString[1];
    const year = dateString[2];
    const time = dateString[3].trim();
    /* const timezone = dateString[4]; */

    const UTCDate = new Date(`${month} ${day}, ${year} ${time}:00`);

    return UTCDate / 1000;
}

main();
