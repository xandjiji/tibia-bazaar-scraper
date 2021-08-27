const GuildPageHelper = require('../Parsers/GuildPageHelper');
const { timeStamp, fetchAndLoad, maxRetry } = require('../utils');
const { MAX_RETRIES } = require('../config');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const helper = new GuildPageHelper()

const main = async () => {
    console.log(`${timeStamp('highlight')} Fetching [Libertabra Pune] guild page`);
    const $ = await fetchGuildPage(guildPageUrl('Libertabra Pune'));
    helper.setHtml($)
    if (helper.maintenanceCheck()) process.exit();

    console.log(helper.guildMembers())
}

const fetchGuildPage = async (url) => {
    return await maxRetry(async () => {
        return await fetchAndLoad(url);;
    }, MAX_RETRIES);
}

const guildPageUrl = (name, online = false) => {
    const url = `https://www.tibia.com/community/?subtopic=guilds&page=view&order=level_desc&GuildName=${encodeURIComponent(name)}&onlyshowonline=${+online}`
    return url
}

main();