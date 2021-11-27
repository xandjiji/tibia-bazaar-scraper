const cheerio = require('cheerio');
const { timeStamp, dateParsing, popNull } = require('../utils');
const { powerfulToReadable } = require('../dataDictionary');
const { quests: questList, outfits: outfitList, mounts: mountList, misc: miscList } = require('./achievements')
const fs = require('fs').promises;

class AuctionPageHelper {
    async init() {
        console.log(`${timeStamp('system')} loading ServerData.json ...`);
        const serverListData = await fs.readFile('./Output/ServerData.json', 'utf-8');
        this.serverData = JSON.parse(serverListData);
    }

    setHtml($) {
        this.$ = $;
    }

    maintenanceCheck() {
        const headingElement = this.$('h1');
        if (headingElement.text() === 'Downtime') {
            return true;
        } else {
            return false;
        }
    }

    errorCheck() {
        const errorElement = this.$('.Text');
        const errorText = errorElement[0].children[0].data;
        if (errorText === 'Error') {
            return true;
        } else {
            return false;
        }
    }

    isFinished() {
        const bidElement = this.$('.MyMaxBidLabel')[0];
        if (bidElement) {
            return false;
        } else {
            return true;
        }
    }

    id() {
        const buttonElement = this.$('a.BigButtonText')[0];
        const splittedString = buttonElement.attribs.onclick.split('auctionid=')[1];
        const id = splittedString.slice(0, splittedString.indexOf('&'));
        return Number(id);
    }

    nickname() {
        return this.$('.Auction .AuctionCharacterName').text();
    }

    auctionEnd() {
        const timestampElement = this.$('.AuctionTimer')[0];

        if (timestampElement) {
            const timestamp = timestampElement.attribs['data-timestamp'];
            return Number(timestamp);
        }

        const auctionEndElement = this.$('.ShortAuctionDataValue');
        const auctionEnd = dateParsing(auctionEndElement[1].children[0].data);
        return auctionEnd;
    }

    currentBid() {
        const currentBidText = this.$('.ShortAuctionDataValue b').text();
        const currentBid = Number(currentBidText.replace(/,/g, ''));
        return currentBid;
    }

    hasBeenBidded() {
        const cancelledText = this.$('.AuctionInfo').text();
        if (cancelledText === 'cancelled') {
            return false;
        }

        const hasBeenBiddedElement = this.$('.ShortAuctionDataLabel');
        const hasBeenBiddedText = hasBeenBiddedElement[2].children[0].data;

        if (hasBeenBiddedText === 'Winning Bid:' || hasBeenBiddedText === 'Current Bid:') {
            return true;
        } else {
            return false;
        }
    }

    outfitId() {
        const outfitElement = this.$('.AuctionOutfitImage');
        const outfitId = outfitElement[0].attribs.src.split('/').pop();
        return outfitId.slice(0, -4);
    }

    serverId() {
        const serverElement = this.$('.AuctionHeader a');
        const serverString = serverElement[0].children[0].data;
        const serverId = this.serverData[serverString];

        if (serverId) {
            return serverId.serverId;
        } else {
            return -1;
        }
    }

    vocationId() {
        const headerElement = this.$('.AuctionHeader')[0];
        const headerData = headerElement.children[2].data.split('|');
        const vocationString = headerData[1];

        if (/knight/gi.test(vocationString)) return 1;
        if (/paladin/gi.test(vocationString)) return 2;
        if (/sorcerer/gi.test(vocationString)) return 3;
        if (/druid/gi.test(vocationString)) return 4;

        return 0;
    }

    level() {
        const headerElement = this.$('.AuctionHeader')[0];
        const headerData = headerElement.children[2].data.split('|');
        const levelRawText = headerData[0];

        return Number(levelRawText.replace(/level: /gi, ''));
    }

    skills() {
        const skillsElement = this.$('.TableContent tbody')[2];
        skillsElement.children.pop();
        const skillsData = skillsElement.children.map(scrapSkill);

        return {
            magic: skillsData[5],
            club: skillsData[1],
            fist: skillsData[4],
            sword: skillsData[7],
            fishing: skillsData[3],
            axe: skillsData[0],
            distance: skillsData[2],
            shielding: skillsData[6]
        }

        function scrapSkill(element) {
            let level = Number(cheerio('.LevelColumn', element).text());
            let percentage = cheerio('.PercentageColumn', element).text();
            percentage = parseFloat(percentage.slice(0, -2));
            percentage = Math.round(percentage);

            return Number(`${level}.${percentage < 10 ? `0${percentage}` : percentage}`);
        }
    }

    items() {
        const featuredItemsElement = this.$('.AuctionItemsViewBox')[0];
        const featuredItemsArray = featuredItemsElement.children.map(scrapItems);

        return popNull(featuredItemsArray);

        function scrapItems(element) {
            const itemTitle = element.attribs.title.split('"');
            if (!itemTitle) return;
            if (itemTitle[0] === '(no item for display selected)') return;

            const itemSrc = element.children[0].attribs.src.split('/').pop();
            return Number(itemSrc.slice(0, -4));
        }
    }

    charms() {
        const charmsElement = this.$('.TableContent tbody')[20];
        charmsElement.children.shift();
        charmsElement.children.pop();

        const charmsData = charmsElement.children.map(scrapCharms);
        return popNull(charmsData);

        function scrapCharms(element) {
            return cheerio('tr:not(.IndicateMoreEntries) td:last-child', element).text();
        }
    }

    transfer() {
        const transferElement = this.$('.TableContent tbody')[4];
        const transferText = transferElement.children[0].children[0].children[1].children[0].data;

        if (transferText === 'can be purchased and used immediately') {
            return true;
        } else {
            return false;
        }
    }

    imbuements() {
        const imbuementsElement = this.$('.TableContent tbody')[19];
        imbuementsElement.children.shift();
        imbuementsElement.children.pop();

        const imbuementsData = imbuementsElement.children.map(scrapImbuements);
        if (!imbuementsData[imbuementsData.length - 1]) {
            imbuementsData.pop();
        }

        return imbuementsData.sort();

        function scrapImbuements(element) {
            const imbuementText = cheerio('tr:not(.IndicateMoreEntries) td', element).text()
            return powerfulToReadable[imbuementText];
        }
    }

    hasSoulwar() {
        const outfitsElement = this.$('.TableContent tbody')[15];

        if (this.level() < 250) {
            return false;
        } else {
            return searchSoulwar(outfitsElement.children[0].children[0].children[0].children[1].children);
        }

        function searchSoulwar(elementArray) {
            for (let i = elementArray.length - 1; i >= 0; i--) {
                const outfitText = elementArray[i].attribs.title;
                if (/Revenant/.test(outfitText)) return true;
            }
            return false;
        }
    }

    quests() {
        const achievementsElement = this.$('.TableContent tbody')[25];
        achievementsElement.children.shift();
        achievementsElement.children.pop();

        const questSet = new Set([])
        achievementsElement.children.forEach((element) => {
            const achievement = element.children[0].children[0].data
            const quest = questList[achievement]
            if (quest) {
                questSet.add(quest)
            }
        })

        const questsElement = this.$('.TableContent tbody')[22];
        questsElement.children.shift();
        questsElement.children.pop();
        questsElement.children.forEach((element) => {
            const questText = element.children[0].children[0].data
            const quest = questList[questText]
            if (quest) {
                questSet.add(quest)
            }
        })

        return [...questSet]
    }

    outfits() {
        const achievementsElement = this.$('.TableContent tbody')[25];
        achievementsElement.children.shift();
        achievementsElement.children.pop();

        const outfitSet = new Set([])
        achievementsElement.children.forEach((element) => {
            const achievement = element.children[0].children[0].data
            const outfit = outfitList[achievement]
            if (outfit) {
                outfitSet.add(outfit)
            }
        })

        const outfitElement = this.$('.TableContent tbody')[15];
        cheerio('.CVIcon', outfitElement).each((_, element) => {
            const title = element.attribs.title
            if (title !== 'Mage (base & addon 1 & addon 2)') return
            if (title !== 'Mage (base & addon 2)') return
            outfitSet.add('Mage')
        })

        return [...outfitSet]
    }

    mounts() {
        const achievementsElement = this.$('.TableContent tbody')[25];
        achievementsElement.children.shift();
        achievementsElement.children.pop();

        const mountSet = new Set([])
        achievementsElement.children.forEach((element) => {
            const achievement = element.children[0].children[0].data
            const mount = mountList[achievement]
            if (mount) {
                mountSet.add(mount)
            }
        })

        const mountElement = this.$('.TableContent tbody')[13];
        cheerio('.CVIcon', mountElement).each((_, element) => {
            const title = element.attribs.title
            if (title === 'Neon Sparkid') mountSet.add('Neon Sparkid')
            if (title === 'Sparkion') mountSet.add('Sparkion')
        })

        return [...mountSet]
    }

    rareAchievements() {
        const achievementsElement = this.$('.TableContent tbody')[25];
        achievementsElement.children.shift();
        achievementsElement.children.pop();

        const achievementSet = new Set([])
        achievementsElement.children.forEach((element) => {
            const achievement = element.children[0].children[0].data
            const rareAchiev = miscList[achievement]
            if (rareAchiev) {
                achievementSet.add(rareAchiev)
            }
        })

        return [...achievementSet]
    }

    charObject() {
        return {
            id: this.id(),
            nickname: this.nickname(),
            auctionEnd: this.auctionEnd(),
            currentBid: this.currentBid(),
            hasBeenBidded: this.hasBeenBidded(),
            outfitId: this.outfitId(),
            serverId: this.serverId(),
            vocationId: this.vocationId(),
            level: this.level(),
            skills: this.skills(),
            items: this.items(),
            charms: this.charms(),
            transfer: this.transfer(),
            imbuements: this.imbuements(),
            hasSoulwar: this.hasSoulwar()
        }
    }
}

module.exports = AuctionPageHelper;