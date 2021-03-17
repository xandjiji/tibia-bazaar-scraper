const { dateParsing } = require('../utils');
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

    fetchError() {
        /* IMPLEMENT */
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
        const buttonElement = this.$('.BigButtonText')[1];
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
            return serverId;
        } else {
            return -1;
        }
    }

}

module.exports = AuctionPageHelper;