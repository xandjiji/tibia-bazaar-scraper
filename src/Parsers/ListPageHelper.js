const { dateParsing } = require('../utils');

class ListPageHelper {
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

    id() {
        const charNameLink = this.$('.AuctionCharacterName a')[0];
        const urlObj = new URL(charNameLink.attribs.href);
        return Number(urlObj.searchParams.get('auctionid'));
    }

    nickname() {
        const charNameLink = this.$('.AuctionCharacterName a')[0];
        const nickname = charNameLink.children[0].data;
        return nickname;
    }

    /* auctionEnd() {
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
    } */
}

module.exports = ListPageHelper;