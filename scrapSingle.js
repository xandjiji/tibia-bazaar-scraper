const { timeStamp, fetchAndLoad, promiseAllInBatches } = require('./utils');
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

    let allSingleData = await promiseAllInBatches(scrapSinglePage, data, 15);

    console.groupEnd();
    console.groupEnd();

    allSingleData = allSingleData.filter(element => element != null);

    await fs.writeFile('allSingleData.json', JSON.stringify(allSingleData));
    console.log(`${timeStamp()} All single data saved to 'allSingleData.json'`);
}

const scrapSinglePage = async (charObject) => {
    const { href, nickname } = charObject;
    try {
        const $ = await fetchAndLoad(href);
        globalIndex++;
        console.log(`${timeStamp()} Scraping ${nickname}'s single page [${globalIndex}/${globalDataSize}]`);

        const serverElement = $('.AuctionHeader a');

        const headerElement = $('.AuctionHeader');
        let headerData = headerElement[0].children[2].data.split('|');
        headerData = headerData.map(string => string.trim());

        const skillsTable = $('.TableContent tbody');
        skillsTable[2].children.pop();
        const skillsData = skillsTable[2].children.map(scrapSkill);

        return {
            ...charObject,
            server: serverElement[0].children[0].data,
            vocation: headerData[1].replace(/vocation: /gi, ''),
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
    } catch (error) {
        console.log(`${timeStamp()} ${nickname} got DENIED! Trying again...`);
        return await scrapSinglePage(charObject);
    }
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