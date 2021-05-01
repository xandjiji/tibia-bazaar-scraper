const pushAndShift = (item, array) => {
    const newArray = [...array];
    newArray.push(item);
    if (newArray.length > 28) newArray.shift();
    return newArray;
}

module.exports = { pushAndShift };