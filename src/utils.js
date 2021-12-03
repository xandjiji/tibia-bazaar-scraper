const fetch = require('node-fetch');
const { Headers } = require('node-fetch');
const FormData = require('form-data')
const UserAgent = require('user-agents');
const cheerio = require('cheerio');
const { DELAY } = require('./config');

const colors = {
    reset: '\x1b[0m',  // white
    fail: '\x1b[31m', // red
    success: '\x1b[32m', // green
    highlight: '\x1b[33m', // yellow
    system: '\x1b[35m', // magenta
    neutral: '\x1b[36m', // cian
    control: '\x1b[90m'  // gray
}

const colorText = (text, color) => {
    return `${colors[color]}${text}${colors['reset']}`;
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

    const { status } = response;
    if (status !== 200) {
        throw new Error(`status code [${status}]`)
    }

    const html = await response.text();
    return cheerio.load(html);
}

const postAndLoad = async (auctionid, type) => {
    const baseUrl = 'https://www.tibia.com/websiteservices/handle_charactertrades.php'

    const headers = new Headers()
    headers.set('X-Requested-With', 'XMLHttpRequest')
    headers.set('User-Agent', new UserAgent().toString())

    const body = new FormData()
    body.append('auctionid', auctionid)
    body.append('type', type)

    const result = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body
    })


    const { status } = result;
    if (status !== 200) {
        throw new Error(`status code [${status}]`)
    }

    const data = await result.json()
    return cheerio.load(data.AjaxObjects[0].Data)
}

const fetchJson = async (url) => {
    const response = await fetch(url);

    const { status } = response;
    if (status !== 200) {
        throw new Error(`status code [${status}]`)
    }

    return await response.json();
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
        if (DELAY > 0) await sleep(DELAY);
    }
    return results;
}

const maxRetry = async (callback, retry) => {
    if (retry > 0) {
        try {
            return await callback();
        } catch (error) {
            console.log(`${timeStamp('fail')} ERROR! Trying again...`);
            if (DELAY > 0) await sleep(DELAY);
            return maxRetry(callback, retry - 1);
        }
    } else {
        console.log(`${timeStamp('control')} Max tries reached`);
        process.exit();
        return null;
    }
}

const makeRangeArray = (start, end) => {
    const array = [];
    for (let i = start; i <= end; i++) {
        array.push(i);
    }
    return array;
}

const popNull = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === undefined || array[i] === '') {
            array.pop()
        } else {
            break;
        }
    }

    return array;
}

const removeDuplicatesFromArrayByKey = (key, array) => {
    const addedSet = new Set([]);
    const newUniqueArray = [];
    for (let i = 0; i < array.length; i++) {

        const currentKey = array[i][key];

        if (!addedSet.has(currentKey)) {
            addedSet.add(currentKey);
            newUniqueArray.push(array[i]);
        }
    }

    return newUniqueArray;
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const dateParsing = (dateString) => {

    dateString = dateString.split(',');
    dateString = [...dateString[0].split(' '), ...dateString[1].split(' ')];

    const month = dateString[0];
    const day = dateString[1];
    const year = dateString[2];
    const time = dateString[3].trim();
    /* const timezone = dateString[4]; */

    const UTCDate = new Date(`${month} ${day}, ${year} ${time}:00`);

    return (UTCDate / 1000) - 18000;
}

const hash = (string) => {
    var hash = 0, i, chr;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
};

module.exports = {
    colorText,
    sleep,
    dateParsing,
    hash,
    makeRangeArray,
    popNull,
    removeDuplicatesFromArrayByKey,
    fetchAndLoad,
    postAndLoad,
    fetchJson,
    timeStamp,
    promiseAllInBatches,
    maxRetry
};