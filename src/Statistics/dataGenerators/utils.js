const pushAndShift = (item, array) => {
    const newArray = [...array];
    newArray.push(item);
    if (newArray.length > 28) newArray.shift();
    return newArray;
}

const getTop10ByKey = (key, data) => {
    data.sort((a, b) => {
        return b[key] - a[key];
    });

    return data.slice(0, 10);
}

const getTop10BySkillKey = (key, data) => {
    data.sort((a, b) => {
        return b.skills[key] - a.skills[key];
    });

    return data.slice(0, 10);
}

const top10BySkillFactory = (key, data) => {
    return getTop10BySkillKey(key, data).map(char => {
        return {
            id: char.id,
            nickname: char.nickname,
            currentBid: char.currentBid,
            [key]: char.skills[key]
        }
    });
}

module.exports = {
    pushAndShift,
    getTop10ByKey,
    getTop10BySkillKey,
    top10BySkillFactory
};