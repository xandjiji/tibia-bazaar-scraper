const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('./utils');
const { dictionary } = require('./dataDictionary');
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('./config');
const cheerio = require('cheerio');
const fs = require('fs').promises;

var serverData;
var globalDataSize;
var globalIndex = 0;

const main = async () => {
    console.log(`${timeStamp('system')} loading bazaarPages.json ...`);
    var data = await fs.readFile('./bazaarPages.json', 'utf-8');
    data = JSON.parse(data);

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
    console.log(`${timeStamp('success')} All single data saved to 'AllCharacterData.json'`);
}

const retryWrapper = async (url) => {
    return await maxRetry(async () => {
        return await scrapSinglePage(url);
    }, MAX_RETRIES);
}

const scrapSinglePage = async (charObject) => {
    const id = charObject[dictionary['id']];
    const nickname = charObject[dictionary['nickname']];
    const $ = await fetchAndLoad(`https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${id}&source=overview`);
    globalIndex++;
    console.log(`${timeStamp('neutral')} Scraping ${nickname}'s single page [${globalIndex}/${globalDataSize}]`);

    const serverElement = $('.AuctionHeader a');

    const headerElement = $('.AuctionHeader');
    let headerData = headerElement[0].children[2].data.split('|');
    headerData = headerData.map(string => string.trim());

    const featuredItems = $('.AuctionItemsViewBox');
    let featuredItemsArray = featuredItems[0].children.map(scrapItems);
    featuredItemsArray = popNull(featuredItemsArray);

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

    return {
        ...charObject,
        [dictionary['outfitId']]: outfitId.slice(0, -4),
        [dictionary['serverId']]: getServerId(serverElement[0].children[0].data),
        [dictionary['vocationId']]: vocationId,
        [dictionary['level']]: Number(headerData[0].replace(/level: /gi, '')),
        [dictionary['skills']]: {
            [dictionary['magic']]: skillsData[5],
            [dictionary['club']]: skillsData[1],
            [dictionary['fist']]: skillsData[4],
            [dictionary['sword']]: skillsData[7],
            [dictionary['fishing']]: skillsData[3],
            [dictionary['axe']]: skillsData[0],
            [dictionary['distance']]: skillsData[2],
            [dictionary['shielding']]: skillsData[6]
        },
        [dictionary['items']]: featuredItemsArray,
        [dictionary['charms']]: charmsData
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
    const level = Number(cheerio('.LevelColumn', element).text());
    let percentage = cheerio('.PercentageColumn', element).text();
    percentage = parseFloat(percentage.slice(0, -2));

    return {
        [dictionary['level']]: level,
        [dictionary['percentage']]: percentage
    }
}

const scrapItems = (element) => {
    const itemTitle = element.attribs.title.split('"');
    if (!itemTitle) return;
    if (itemTitle[0] === '(no item for display selected)') return;

    const itemSrc = element.children[0].attribs.src.split('/').pop();
    return itemSrc.slice(0, -4);
}

const scrapCharms = (element) => {
    const charmString = cheerio('tr:not(.IndicateMoreEntries) td:last-child', element).text();

    return dictionary[charmString];
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

main();