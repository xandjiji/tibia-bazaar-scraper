const fs = require('fs').promises;

const files = [
    'ServerData.json',
    'bazaarPages.json',
    'AllCharacterData.json',
    'AllCharacterData.json',
    'LatestCharacterData.json',
    'ItemsData.json',
    'readableBazaarHistory.json'
]

const main = async () => {
    await Promise.all(files.map(outputLogCount));
}

const readAndParse = async (file) => {
    const data = await fs.readFile(`./Output/${file}`, 'utf-8');
    return JSON.parse(data);
}

const getFileCount = async (file) => {
    const data = await readAndParse(file);

    if (Array.isArray(data)) {
        return data.length;
    } else {
        return Object.keys(data).length;
    }

}

const outputLogCount = async (file) => {
    const count = await getFileCount(file);

    console.log(`${file}${identSpace(file, 30)}${count} items`);
}

const identSpace = (string, size) => {
    let acc = '';
    for (i = string.length; i <= size; i++) {
        acc += ' ';
    }

    return acc;
}

main();