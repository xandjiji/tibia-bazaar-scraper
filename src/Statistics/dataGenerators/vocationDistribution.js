module.exports = (data) => {
    const vocationCount = {
        rooker: 0,
        knight: 0,
        paladin: 0,
        sorcerer: 0,
        druid: 0
    }
    const keyArray = Object.keys(vocationCount);
    for (const char of data) {
        const vocation = keyArray[char.vocationId];
        vocationCount[vocation]++
    }

    return {
        rooker: (vocationCount.rooker / data.length * 100).toFixed(2),
        knight: (vocationCount.knight / data.length * 100).toFixed(2),
        paladin: (vocationCount.paladin / data.length * 100).toFixed(2),
        sorcerer: (vocationCount.sorcerer / data.length * 100).toFixed(2),
        druid: (vocationCount.druid / data.length * 100).toFixed(2)
    }
}