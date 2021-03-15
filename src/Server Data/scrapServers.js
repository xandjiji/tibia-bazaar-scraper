const { timeStamp, fetchAndLoad } = require('../utils');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const baseUrl = 'https://www.tibia.com/community/?subtopic=worlds';

const allServersObject = {};

const main = async () => {
    console.log(`${timeStamp('highlight')} Scraping server list`);
    const $ = await fetchAndLoad(baseUrl);

    const tableContent = $('.TableContent tbody');
    tableContent[2].children.shift();
    tableContent[2].children.pop();

    for(const [index, serverElement] of tableContent[2].children.entries()) {
        scrapServer(serverElement, index);
    }

    await fs.writeFile('./Output/ServerData.json', JSON.stringify(allServersObject));
    console.log(`${timeStamp('success')} All server data saved to 'ServerData.json'`);
}

const scrapServer = (element, serverId) => {

    const item = cheerio('td', element);
    const serverName = item[0].children[0].children[0].data;

    let serverLocation;
    switch (item[2].children[0].data) {
        case 'Europe':
            serverLocation = {
                string: 'EU',
                type: 0
            };
            break;

        case 'North America':
            serverLocation = {
                string: 'NA',
                type: 1
            };
            break;

        case 'South America':
            serverLocation = {
                string: 'BR',
                type: 2
            };
            break;

        default:
            serverLocation = {
                string: 'BR',
                type: 2
            };
            break;
    }

    let pvpType;
    switch (item[3].children[0].data) {
        case 'Optional PvP':
            pvpType = {
                string: 'Optional',
                type: 0
            };
            break;

        case 'Open PvP':
            pvpType = {
                string: 'Open',
                type: 1
            };
            break;

        case 'Retro Open PvP':
            pvpType = {
                string: 'Retro Open',
                type: 2
            };
            break;

        case 'Hardcore PvP':
            pvpType = {
                string: 'Hardcore',
                type: 3
            };
            break;

        case 'Retro Hardcore PvP':
            pvpType = {
                string: 'Retro Hardcore',
                type: 4
            };
            break;

        default:
            pvpType = {
                string: 'Optional',
                type: 0
            };
            break;
    }

    let battleye = false;
    if(item[4].children[0] !== undefined) {
        if(item[4].children[1].children[0].children[0].children[0].attribs.src === 'https://static.tibia.com/images/global/content/icon_battleyeinitial.gif') {
            battleye = true;
        }
    }

    allServersObject[serverName] = {
        serverId,
        serverName,
        serverLocation,
        pvpType,
        battleye,
        experimental: (serverName === 'Zuna' || serverName === 'Zunera' ? true : false)
    }
}

main();