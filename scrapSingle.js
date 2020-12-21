const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('./utils');
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('./config');
const cheerio = require('cheerio');
const fs = require('fs').promises;

var serverData = {};
var globalDataSize;
var globalIndex = 0;

const main = async () => {
    console.log(`${timeStamp('system')} loading allCharacterData.json ...`);
    var data = await fs.readFile('./allCharacterData.json', 'utf-8');
    data = JSON.parse(data);

    console.log(`${timeStamp('system')} loading serverData.json ...`);
    console.group();
    var serverListData = await fs.readFile('./serverData.json', 'utf-8');
    serverListData = JSON.parse(serverListData);
    for(server of serverListData) {
        serverData[server.serverName] = server;
    }

    globalDataSize = data.length;

    console.log(`${timeStamp('highlight')} Scraping every single page:`);
    console.group();

    let allSingleData = await promiseAllInBatches(retryWrapper, data, MAX_CONCURRENT_REQUESTS);

    console.groupEnd();
    console.groupEnd();

    allSingleData = allSingleData.filter(element => element != null);

    await fs.writeFile('allSingleData.json', JSON.stringify(allSingleData));
    console.log(`${timeStamp('success')} All single data saved to 'allSingleData.json'`);
}

const retryWrapper = async (url) => {
    return await maxRetry(async () => {
        return await scrapSinglePage(url);
    }, MAX_RETRIES);
}

const scrapSinglePage = async (charObject) => {
    const { href, nickname } = charObject;
    const $ = await fetchAndLoad(href);
    globalIndex++;
    console.log(`${timeStamp('neutral')} Scraping ${nickname}'s single page [${globalIndex}/${globalDataSize}]`);

    const serverElement = $('.AuctionHeader a');

    const headerElement = $('.AuctionHeader');
    let headerData = headerElement[0].children[2].data.split('|');
    headerData = headerData.map(string => string.trim());

    const vocationString = headerData[1].replace(/vocation: /gi, '');
    const vocationId = getVocationId(vocationString);

    const tableContent = $('.TableContent tbody');
    tableContent[2].children.pop();
    const skillsData = tableContent[2].children.map(scrapSkill);

    tableContent[19].children.shift();
    tableContent[19].children.pop();
    const imbumentsData = tableContent[19].children.map(scrapImbuiments);
    if(imbumentsData[imbumentsData.length - 1] === '') {
        imbumentsData.pop();
    }

    tableContent[20].children.shift();
    tableContent[20].children.pop();
    const charmsData = tableContent[20].children.map(scrapCharms);
    if(charmsData[charmsData.length - 1] === '') {
        charmsData.pop();
    }

    return {
        ...charObject,
        server: serverData[serverElement[0].children[0].data],
        vocationId: vocationId,
        vocation: vocationString,
        sex: headerData[2],
        level: Number(headerData[0].replace(/level: /gi, '')),
        skills: {
            magic: skillsData[5],
            fist: skillsData[4],
            club: skillsData[1],
            sword: skillsData[7],
            axe: skillsData[0],
            distance: skillsData[2],
            shielding: skillsData[6],
            fishing: skillsData[3]
        },
        imbuiments: imbumentsData,
        chams: charmsData

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
        level,
        percentage
    }
}

const scrapImbuiments = (element) => {
    return cheerio('tr:not(.IndicateMoreEntries) td', element).text();
}

const scrapCharms = (element) => {
    return cheerio('tr:not(.IndicateMoreEntries) td:last-child', element).text();
}

main();