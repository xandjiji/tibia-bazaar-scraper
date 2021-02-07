const { timeStamp, fetchAndLoad, promiseAllInBatches, maxRetry } = require('./utils');
const { dictionary } = require('./dataDictionary');
const { MAX_CONCURRENT_REQUESTS, MAX_RETRIES } = require('./config');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const { log } = require('console');

const bazaarUrl = 'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades';

/*
    &searchstring=Cobra
    &searchtype=2
    &currentpage=1
*/

const itemList = ['Dwarven Shield', 'Cobra Axe']

const main = async () => {

    for(const item of itemList) {

    }
}

const retryWrapper = async (itemName) => {
    return await maxRetry(async () => {
        return await scrapItemPages(itemName);
    }, MAX_RETRIES);
}

const scrapItemPages = async (itemName) => {
    console.log(`${timeStamp('system')} Loading ${itemName}'s first page...`);

    const encodedURI = encodeURI(`${bazaarUrl}&searchstring=${itemName}&searchtype=2&currentpage=`)
    const $ = await fetchAndLoad(`${encodedURI}`);

    const lastPageElement = $('.PageNavigation .PageLink:last-child a');
    const href = new URL(lastPageElement[0].attribs.href);
    const lastPageIndex = Number(href.searchParams.get('currentpage'));

    const itemPagesUrl = [];
    for(let i = 1; i <= lastPageIndex; i++) {
        itemPagesUrl.push(`${encodedURI}${i}`)
    }
    
}

scrapItemPages('Cobra Hood');