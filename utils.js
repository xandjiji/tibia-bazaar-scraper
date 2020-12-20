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

module.exports = { fetchAndLoad, timeStamp }