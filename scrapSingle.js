const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('./utils');
const cheerio = require('cheerio');
const fs = require('fs').promises;

var globalDataSize;
var globalIndex = 0;

const main = async () => {
    console.log(`${timeStamp()} loading allCharacterData.json ...`);
    console.group();
    var data = await fs.readFile('./allCharacterData.json', 'utf-8');
    data = JSON.parse(data);

    globalDataSize = data.length;

    console.log(`${timeStamp()} Scraping every single page:`);
    console.group();

    let allSingleData = await promiseAllInBatches(retryWrapper, data, 15);

    console.groupEnd();
    console.groupEnd();

    allSingleData = allSingleData.filter(element => element != null);

    await fs.writeFile('allSingleData.json', JSON.stringify(allSingleData));
    console.log(`${timeStamp()} All single data saved to 'allSingleData.json'`);
}

const retryWrapper = async (url) => {
    return await maxRetry(async () => {
        return await scrapSinglePage(url);
    }, 5);
}

const scrapSinglePage = async (charObject) => {
    const { href, nickname } = charObject;
    const $ = await fetchAndLoad(href);
    globalIndex++;
    console.log(`${timeStamp()} Scraping ${nickname}'s single page [${globalIndex}/${globalDataSize}]`);

    const serverElement = $('.AuctionHeader a');

    const headerElement = $('.AuctionHeader');
    let headerData = headerElement[0].children[2].data.split('|');
    headerData = headerData.map(string => string.trim());

    const vocationString = headerData[1].replace(/vocation: /gi, '');
    const vocationId = getVocationId(vocationString);

    const skillsTable = $('.TableContent tbody');
    skillsTable[2].children.pop();
    const skillsData = skillsTable[2].children.map(scrapSkill);

    return {
        ...charObject,
        server: serverElement[0].children[0].data,
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
        }
    }
}

const getVocationId = (vocationString) => {
    if(/knight/gi.test(vocationString)) return 1;
    if(/paladin/gi.test(vocationString)) return 2;
    if(/sorcerer/gi.test(vocationString)) return 3;
    if(/druid/gi.test(vocationString)) return 4;

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

main();