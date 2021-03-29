const fs = require('fs').promises;
const { colorText } = require('./utils');

const files = [
    'bazaarPages.json',
    'AllCharacterData.json',
    'LatestCharacterData.json',
    'MinifiedCharacterData.json',
    'readableBazaarHistory.json',
    'MinifiedBazaarHistory.json'
]

const main = async () => {
    const strings = await Promise.all(files.map(makeLogString));
    strings.forEach(item => console.log(item));

    await logUnfinishedItems();
}

const getFile = async (file) => {
    const data = await fs.readFile(`./Output/${file}`, 'utf-8');
    const fileObject = JSON.parse(data);

    const fileStats = await fs.stat(`./Output/${file}`);

    const fileSizeMb = fileStats.size / (1024 * 1024);

    return {
        count: fileObject.length,
        fileSize: fileSizeMb.toFixed(2),
        fileLastModified: fileStats.mtime
    };
}

const makeLogString = async (fileName) => {
    const { count, fileSize, fileLastModified } = await getFile(fileName);

    return `${colorText(fileName, 'success')}
        ${colorText(`${count} items`, 'highlight')}
        ${colorText(`${fileSize} MB`, 'system')}
        ${colorText(`Last edited: ${fileLastModified}`, 'neutral')}
    `;
}

const identSpace = (string, size) => {
    let acc = '';
    for (i = string.length; i <= size; i++) {
        acc += ' ';
    }

    return acc;
}

const logUnfinishedItems = async () => {
    const fileName = 'scrapHistoryData.json';
    const data = await fs.readFile(`./Output/${fileName}`, 'utf-8');
    const fileObject = JSON.parse(data);

    const { unfinishedAuctions } = fileObject;

    const fileStats = await fs.stat(`./Output/${fileName}`);
    const fileSizeMb = fileStats.size / (1024 * 1024);

    const logString = `${colorText(fileName, 'success')}
        ${colorText(`${unfinishedAuctions.length} items`, 'highlight')}
        ${colorText(`${fileSizeMb.toFixed(2)} MB`, 'system')}
        ${colorText(`Last edited: ${fileStats.mtime}`, 'neutral')}
    `

    console.log(logString);
}

main();