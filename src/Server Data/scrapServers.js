const ServerPageHelper = require('../Parsers/ServerPageHelper');
const { timeStamp, fetchAndLoad, maxRetry } = require('../utils');
const { MAX_RETRIES } = require('../config');
const cheerio = require('cheerio');
const fs = require('fs').promises;

var serverData;

const helper = new ServerPageHelper();

const main = async () => {
    console.log(`${timeStamp('system')} loading ServerData.json ...`);
    const serverListData = await fs.readFile('./Output/ServerData.json', 'utf-8');
    serverData = JSON.parse(serverListData);

    console.log(`${timeStamp('highlight')} Scraping server list`);
    const $ = await fetchServerListPage('https://www.tibia.com/community/?subtopic=worlds');
    helper.setHtml($);

    const serverArray = helper.serverArray();

    serverArray.each((index, element) => {

        helper.setHtml(cheerio.load(element));

        const serverName = helper.serverName();
        if (!serverData[serverName]) {
            serverData[serverName] = {
                serverId: Object.keys(serverData).length,
                ...helper.serverObject()
            }
        }
    });

    await fs.writeFile('./Output/ServerData.json', JSON.stringify(serverData));
    console.log(`${timeStamp('success')} All server data saved to 'ServerData.json'`);
}

const fetchServerListPage = async (url) => {
    return await maxRetry(async () => {
        return await fetchAndLoad(url);;
    }, MAX_RETRIES);
}

main();