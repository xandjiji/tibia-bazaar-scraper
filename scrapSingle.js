const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('./utils');
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

    console.log(`${timeStamp('system')} loading serverData.json ...`);
    console.group();
    var serverListData = await fs.readFile('./serverData.json', 'utf-8');
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
    const { id, nickname } = charObject;
    const $ = await fetchAndLoad(`https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades&page=details&auctionid=${id}&source=overview`);
    globalIndex++;
    console.log(`${timeStamp('neutral')} Scraping ${nickname}'s single page [${globalIndex}/${globalDataSize}]`);

    const serverElement = $('.AuctionHeader a');

    const headerElement = $('.AuctionHeader');
    let headerData = headerElement[0].children[2].data.split('|');
    headerData = headerData.map(string => string.trim());

    const featuredItems = $('.AuctionItemsViewBox');
    const featuredItemsArray = featuredItems[0].children.map(scrapItems);

    const vocationString = headerData[1].replace(/vocation: /gi, '');
    const vocationId = getVocationId(vocationString);

    const outfitElement = $('.AuctionOutfitImage');  
    const outfitId = outfitElement[0].attribs.src.split('/').pop();

    const tableContent = $('.TableContent tbody');
    tableContent[2].children.pop();
    const skillsData = tableContent[2].children.map(scrapSkill);

    tableContent[20].children.shift();
    tableContent[20].children.pop();
    const charmsData = tableContent[20].children.map(scrapCharms);
    if(charmsData[charmsData.length - 1] === '') {
        charmsData.pop();
    }

    return {
        ...charObject,
        outfitId: outfitId.slice(0, -4),
        server: getServerId(serverElement[0].children[0].data),
        vocationId: vocationId,
        vocation: vocationString,
        level: Number(headerData[0].replace(/level: /gi, '')),
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
        charms: charmsData
    }
}

const getServerId = (serverString) => {
    for(let i = 0; i < serverData.length; i++) {
        if(serverData[i].serverName === serverString) return i;
    }
    return -1;
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
        level,
        percentage
    }
}

const scrapItems = (element) => {
    const itemTitle = element.attribs.title.split('"');

    if(itemTitle[1] === '(no item for display selected)') return;

    let amount = 0;
    if(element.children[1]) {
        amount = Number(element.children[1].children[0].data);
    }

    const itemSrc = element.children[0].attribs.src.split('/').pop();
    
    return {
        name: itemTitle[1],
        src: itemSrc.slice(0, -4),
        amount
    }
}

const scrapCharms = (element) => {
    return cheerio('tr:not(.IndicateMoreEntries) td:last-child', element).text();
}

main();