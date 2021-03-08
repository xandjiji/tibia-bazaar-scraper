const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('./utils');
const { powerfulToReadable } = require('./dataDictionary');
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

    /* data = data.slice(0, 20); */

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
    const id = charObject.id;
    const nickname = charObject.nickname;
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
        ...charObject,
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

main();