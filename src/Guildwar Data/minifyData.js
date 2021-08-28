const { minifyGuildData } = require('../warMinify');
const fs = require('fs').promises;

const fileNameA = 'LibertabraPuneData'
const fileNameB = 'BonesAllianceData'

const main = async () => {
    let dataGuildA = await fs.readFile(`./Output/war/${fileNameA}.json`, 'utf-8');
    dataGuildA = JSON.parse(dataGuildA)

    let dataGuildB = await fs.readFile(`./Output/war/${fileNameB}.json`, 'utf-8');
    dataGuildB = JSON.parse(dataGuildB)

    const minifiedA = minifyGuildData(dataGuildA)
    const minifiedB = minifyGuildData(dataGuildB)

    await fs.writeFile(`./Output/war/mini${fileNameA}.json`, JSON.stringify(minifiedA))
    await fs.writeFile(`./Output/war/mini${fileNameB}.json`, JSON.stringify(minifiedB))
}

main()