const fs = require('fs').promises;
const { timeStamp } = require('../utils');

const getDeathsHashset = async () => {
    console.log(`${timeStamp('system')} loading deathHash.json ...`);
    try {
        const deathArray = await fs.readFile(`./Output/war/deathHash.json`, 'utf-8');
        return new Set([...JSON.parse(deathArray)])
    } catch (error) {
        return new Set([])
    }
}

const saveDeathsHashset = async (deathSet) => {
    await fs.writeFile(`./Output/war/deathHash.json`, JSON.stringify([...deathSet]));
    console.log(`${timeStamp('success')} Death hashset data was saved to 'deathHash.json'`);
}

module.exports = {
    getDeathsHashset,
    saveDeathsHashset
};