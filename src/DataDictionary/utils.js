const sortDec = (a, b) => a - b

const lowerCaseKeys = (object) => {
    const newObject = {}
    Object.keys(object).forEach((key) => newObject[key.toLowerCase()] = object[key])

    return newObject
}

const dictionaryFactory = (keyArray) => {
    const dictionaryObject = {
        ...keyArray
    };

    for (const [keyValue, keyItem] of keyArray.entries()) {
        dictionaryObject[keyItem] = keyValue;
    }

    return dictionaryObject;
}

module.exports = { sortDec, lowerCaseKeys, dictionaryFactory }