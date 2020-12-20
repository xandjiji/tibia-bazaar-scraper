const { timeStamp, fetchAndLoad } = require('./utils');
const cheerio = require('cheerio');
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
            ...await scrapBazaarPage(i)
        ]
    }

    console.groupEnd();
    console.groupEnd();

    await fs.writeFile('allCharacterData.json', JSON.stringify(allBazaarCharacters));
    console.log(`${timeStamp()} All character data saved to 'allCharacterData.json'`);
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

        const urlObj = new URL(charNameLink[0].attribs.href);

        const charObject = {
            id: Number(urlObj.searchParams.get('auctionid')),
            nickname: charNameLink[0].children[0].data,
            href: urlObj.href,
            auctionEnd: Number(charAuctionEnd[0].attribs['data-timestamp']),
            currentBid: Number(charBidAmount[0].children[0].data.replace(/,/g, '')),
            hasBeenBidded: (charBidStatus[0].children[0].data === 'Current Bid:' ? true : false)
        }

        charactersData.push(charObject);
    });

    return charactersData;
}

main();
