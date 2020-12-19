const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs').promises;

const bazaarUrl = 'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades';

const main = async () => {
    console.log(`${timeStamp()} Loading first page...`);
    console.group();
    const $ = await fetchAndLoad(bazaarUrl);

    const lastPageElement = $('.PageNavigation .PageLink:last-child a');
    const href = new URL(lastPageElement[0].attribs.href);
    const lastPageIndex = Number(href.searchParams.get('currentpage'));

    console.log(`${timeStamp()} Scraping every Bazaar page:`);
    console.group();
    let allBazaarCharacters = [];
    for (let i = 1; i <= lastPageIndex; i++) {
        allBazaarCharacters = [
            ...allBazaarCharacters,
            await scrapBazaarPage(i)
        ]
    }

    console.groupEnd();
    console.groupEnd();

    await fs.writeFile('allCharacterData.json', JSON.stringify(allBazaarCharacters));
    console.log(`${timeStamp()} All character data saved to 'allCharacterData.json'`);
}

const timeStamp = () => {
    let time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric', second: 'numeric' });
    return `[${time}]`;
}

const fetchAndLoad = async (url) => {
    const response = await fetch(url);
    const html = await response.text();
    return cheerio.load(html);
}

const scrapBazaarPage = async (index) => {
    console.log(`${timeStamp()} Scraping Bazaar page [${index}]`);
    const $ = await fetchAndLoad(`${bazaarUrl}&currentpage=${index}`);
    const auctions = $('.Auction');

    let charactersData = [];

    auctions.each((index, element) => {
        const $ = cheerio.load(element);
        const charNameLink = $('.AuctionCharacterName a');
        const charAuctionEnd = $('.AuctionTimer');
        const charBidAmount = $('.ShortAuctionDataValue b');
        const charBidStatus = $('.ShortAuctionDataBidRow .ShortAuctionDataLabel');

        const charObject = {
            nickname: charNameLink[0].children[0].data,
            href: charNameLink[0].attribs.href,
            auctionEnd: charAuctionEnd[0].attribs['data-timestamp'],
            currentBid: Number(charBidAmount[0].children[0].data.replace(/,/g, '')),
            hasBeenBidded: (charBidStatus[0].children[0].data === 'Current Bid:' ? true : false)
        }

        charactersData.push(charObject);
    });

    return charactersData;
}

main();
