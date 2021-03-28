const fs = require('fs').promises;
const { hash } = require('../utils');

const main = async () => {
    let historyData = await fs.readFile(`./Output/MinifiedBazaarHistory.json`, 'utf-8');
    historyData = JSON.parse(historyData);
    historyData.reverse();

    const slicedHistoryData = chop(historyData, 10000);

    const hashedArray = await Promise.all(slicedHistoryData.map(savePaginatedData));
    await fs.writeFile(`./Output/PaginatedHistory/hash.json`, JSON.stringify(hashedArray));
}

const chop = (data, size) => {
    const iterationCount = Math.ceil(data.length / size);

    const slicesArray = [];
    for (let i = 0; i < iterationCount; i++) {
        const currentSlice = data.slice(i * size, (i + 1) * size);
        slicesArray.push(currentSlice);
    }

    return slicesArray;
}

const savePaginatedData = async (dataPage, index) => {
    const stringfiedData = JSON.stringify(dataPage)
    await fs.writeFile(`./Output/PaginatedHistory/historyData${index}.json`, stringfiedData);

    return hash(stringfiedData);
}

main();