const fetch = require('node-fetch');
const cheerio = require('cheerio');

const fetchAndLoad = async (url) => {
    const response = await fetch(url);
    const html = await response.text();
    return cheerio.load(html);
}

const timeStamp = () => {
    let time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' });
    return `[${time}]`;
}

const promiseAllInBatches = async (task, items, batchSize) => {
    let position = 0;
    let results = [];
    while (position < items.length) {
        const itemsForBatch = items.slice(position, position + batchSize);
        results = [...results, ...await Promise.all(itemsForBatch.map(item => task(item)))];
        position += batchSize;
    }
    return results;
}

module.exports = { fetchAndLoad, timeStamp, promiseAllInBatches }