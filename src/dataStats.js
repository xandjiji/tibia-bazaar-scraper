const fs = require('fs').promises;
const { colorText } = require('./utils');

const files = [
    {
        fileName: 'bazaarPages.json',
        color: 'highlight'
    },
    {
        fileName: 'AllCharacterData.json',
        color: 'highlight'
    },
    {
        fileName: 'LatestCharacterData.json',
        color: 'highlight'
    },
    {
        fileName: 'readableBazaarHistory.json',
        color: 'system'
    }
]

const main = async () => {
    const strings = await Promise.all(files.map(makeLogString));
    strings.forEach(item => console.log(item));
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

const makeLogString = async (file) => {
    const { fileName, color } = file;
    const count = await getFileCount(fileName);

    return `${colorText(fileName, color)}${identSpace(fileName, 30)}${colorText(`${count} items`, 'success')}`;
}

const identSpace = (string, size) => {
    let acc = '';
    for (i = string.length; i <= size; i++) {
        acc += ' ';
    }

    return acc;
}

main();