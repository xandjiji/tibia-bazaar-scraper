const fetch = require("node-fetch");
const fs = require("fs").promises;
const { timeStamp } = require('./utils');

const main = async () => {
    console.log(`${timeStamp('system')} loading LatestCharacterData.json ...`);
    let currentAuctions = await fs.readFile(
        "./Output/LatestCharacterData.json",
        "utf-8"
    );
    currentAuctions = JSON.parse(currentAuctions);

    console.log(`${timeStamp('system')} loading ServerData.json ...`);
    let serverData = await fs.readFile('./Output/ServerData.json', 'utf-8');
    serverData = Object.values(JSON.parse(serverData));

    console.log(`${timeStamp('system')} fetching highlighted data from endpoint ...`);
    let highlightedAuctions = await fetch(
        "https://exevo-pan-highlighted.netlify.app/highlighted.json"
    );
    highlightedAuctions = await highlightedAuctions.json();

    const currentDate = currentStringDate();
    highlightedAuctions = highlightedAuctions
        .map(normalizeAuctionDates)
        .filter((auction) =>
            auction.days.includes(currentDate)
        );

    const highlightedIds = highlightedAuctions.map((auction) => auction.id)

    const highlightedAuctionsObject = currentAuctions
        .filter((auction) => highlightedIds.includes(auction.id))
        .map((auction) => ({
            ...auction,
            serverData: serverData.find(({ serverId }) => serverId === auction.serverId)
        }))

    await fs.writeFile('./Output/HighlightedAuctions.json', JSON.stringify(highlightedAuctionsObject));
};

const padDate = (value) => value.toString().padStart(2, '0')

const normalizeAuctionDates = (auction) =>
({
    ...auction,
    days: auction.days.map((dateString) => dateString
        .split('/')
        .map(padDate)
        .join('/'))
})

const currentStringDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${padDate(day)}/${padDate(month)}/${year}`
};

main();
