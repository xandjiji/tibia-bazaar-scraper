const { timeStamp, fetchAndLoad, promiseAllInBatches } = require('./utils');
const cheerio = require('cheerio');
const fs = require('fs').promises;

const bazaarUrl = 'https://www.tibia.com/charactertrade/?subtopic=currentcharactertrades';

var globalDataSize;
var globalIndex = 0;

const main = async () => {
    console.log(`${timeStamp()} Loading first page...`);
    console.group();
    const $ = await fetchAndLoad(bazaarUrl);

    const lastPageElement = $('.PageNavigation .PageLink:last-child a');
    const href = new URL(lastPageElement[0].attribs.href);
    const lastPageIndex = Number(href.searchParams.get('currentpage'));

    globalDataSize = lastPageIndex;

    let bazaarPages = [];
    for (let i = 1; i <= lastPageIndex; i++) {
        bazaarPages.push(`${bazaarUrl}&currentpage=${i}`);
    }

    console.log(`${timeStamp()} Scraping every Bazaar page:`);
    console.group();

    bazaarPages = await promiseAllInBatches(scrapBazaarPage, bazaarPages, 15);

    let allBazaarCharacters = [];
    for (let i = 0; i < bazaarPages.length; i++) {
        allBazaarCharacters.push(...bazaarPages[i]);
    }

    console.groupEnd();
    console.groupEnd();

    await fs.writeFile('allCharacterData.json', JSON.stringify(allBazaarCharacters));
    console.log(`${timeStamp()} All character data saved to 'allCharacterData.json'`);
}

const scrapBazaarPage = async (url) => {
    try {
        const $ = await fetchAndLoad(url);
        globalIndex++;
        console.log(`${timeStamp()} Scraping Bazaar page [${globalIndex}/${globalDataSize}]`);

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
    } catch (error) {
        console.log(`${timeStamp()} '${url}' got DENIED! Trying again...`);
        return await scrapSinglePage(charObject);
    }
}

main();
