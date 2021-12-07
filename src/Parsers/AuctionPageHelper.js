const cheerio = require('cheerio');
const { dateParsing, popNull } = require('../utils');
const {
    imbuement,
    quest: { scrapingTokens: questList },
    rareAchievement: { scrapingTokens: rareAchievementList }
} = require('../DataDictionary/dictionaries');
const PostDataHelper = require('./PostDataHelper')

class AuctionPageHelper {
    postHelper = new PostDataHelper()

    init(serverListData) {
        this.serverData = serverListData;
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

    sex() {
        const headerElement = this.$('.AuctionHeader')[0];
        const [, , sex] = headerElement.children[2].data.split(' | ');

        return sex === 'Female';
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
        const charmsElement = this.$('.TableContent tbody')[21];
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
        const imbuementsElement = this.$('.TableContent tbody')[20];
        imbuementsElement.children.shift();
        imbuementsElement.children.pop();

        const imbuementsData = imbuementsElement.children.map(scrapImbuements);
        if (!imbuementsData[imbuementsData.length - 1]) {
            imbuementsData.pop();
        }

        return imbuementsData.sort();

        function scrapImbuements(element) {
            const imbuementText = cheerio('tr:not(.IndicateMoreEntries) td', element).text()?.toLowerCase()
            return imbuement.scrapingTokens[imbuementText];
        }
    }

    quests() {
        const achievementsElement = this.$('.TableContent tbody')[26];
        achievementsElement.children.shift();
        achievementsElement.children.pop();

        const questSet = new Set([])
        achievementsElement.children.forEach((element) => {
            const achievement = element.children[0].children[0].data?.trim()?.toLowerCase()
            const quest = questList[achievement]
            if (quest) {
                questSet.add(quest)
            }
        })

        const questsElement = this.$('.TableContent tbody')[23];
        questsElement.children.shift();
        questsElement.children.pop();
        questsElement.children.forEach((element) => {
            const questText = element.children[0].children[0].data?.toLowerCase()
            const quest = questList[questText]
            if (quest) {
                questSet.add(quest)
            }
        })

        return [...questSet]
    }

    lastPageIndex(id) {
        const lastPageLink = this.$(`#${id} .TableContent tbody .PageLink:last-child a`);

        let lastIndex = 1
        lastPageLink.each((_, element) => {
            const { href } = element.attribs
            const [, lastPageIndex] = href.split('&currentpage=')
            lastIndex = lastPageIndex
        })

        return lastIndex
    }

    outfits() {
        const firstPage = this.$(`#Outfits .TableContent tbody .BlockPage .CVIcon`)
        return this.postHelper.outfits(firstPage)
    }

    storeOutfits() {
        const firstPage = this.$(`#StoreOutfits .TableContent tbody .BlockPage .CVIcon`)
        return this.postHelper.outfits(firstPage)
    }

    mounts() {
        const firstPage = this.$(`#Mounts .TableContent tbody .BlockPage .CVIcon`)
        return this.postHelper.mounts(firstPage)
    }

    storeMounts() {
        const firstPage = this.$(`#StoreMounts .TableContent tbody .BlockPage .CVIcon`)
        return this.postHelper.mounts(firstPage)
    }

    rareAchievements() {
        const achievementsElement = this.$('.TableContent tbody')[26];
        achievementsElement.children.shift();
        achievementsElement.children.pop();

        const achievementSet = new Set([])
        achievementsElement.children.forEach((element) => {
            const achievement = element.children[0].children[0].data?.trim()?.toLowerCase()
            const rareAchiev = rareAchievementList[achievement]
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
            sex: this.sex(),
            level: this.level(),
            skills: this.skills(),
            items: this.items(),
            charms: this.charms(),
            transfer: this.transfer(),
            imbuements: this.imbuements(),
            quests: this.quests(),
            outfits: this.outfits(),
            storeOutfits: this.storeOutfits(),
            mounts: this.mounts(),
            storeMounts: this.storeMounts(),
            rareAchievements: this.rareAchievements()
        }
    }
}

module.exports = AuctionPageHelper;