const fetch = require('node-fetch');
const UserAgent = require('user-agents');
const cheerio = require('cheerio');

const colors = {
    reset: '\x1b[0m',  // white
    fail: '\x1b[31m', // red
    success: '\x1b[32m', // green
    highlight: '\x1b[33m', // yellow
    system: '\x1b[35m', // magenta
    neutral: '\x1b[36m', // cian
    control: '\x1b[90m'  // gray
}

const timeStamp = (color) => {
    let time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' });

    if (color) {
        return `${colors[color]}[${time}]${colors['reset']}`;
    } else {
        return `[${time}]`;
    }
}

const fetchAndLoad = async (url) => {
    const userAgent = new UserAgent();

    const response = await fetch(url, {
        headers: {
            'User-Agent': userAgent.toString()
        }
    });
    const html = await response.text();
    return cheerio.load(html);
}

const promiseAllInBatches = async (task, items, batchSize, onEachBatch) => {
    let position = 0;
    let results = [];
    while (position < items.length) {
        const itemsForBatch = items.slice(position, position + batchSize);
        let currentResults = await Promise.all(itemsForBatch.map(item => task(item)));
        results = [...results, ...currentResults];
        position += batchSize;
        if (onEachBatch) await onEachBatch(currentResults);
    }
    return results;
}

const maxRetry = async (callback, retry) => {
    if (retry > 0) {
        try {
            return await callback();
        } catch (error) {
            console.log(`${timeStamp('fail')} ERROR! Trying again...`);
            return maxRetry(callback, retry - 1);
        }
    } else {
        console.log(`${timeStamp('control')} Max tries reached`);
        process.exit();
        return null;
    }
}

module.exports = { fetchAndLoad, timeStamp, promiseAllInBatches, maxRetry };