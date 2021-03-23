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
        const currentBidText = this.$('.ShortAuctionDataValue b')[0];
        const currentBid = Number(currentBidText.children[0].data.replace(/,/g, ''));
        return currentBid;
    }

    hasBeenBidded() {
        const hasBeenBiddedElement = this.$('.ShortAuctionDataBidRow .ShortAuctionDataLabel')[0];
        const hasBeenBiddedText = hasBeenBiddedElement.children[0].data;

        if (hasBeenBiddedText === 'Winning Bid:' || hasBeenBiddedText === 'Current Bid:') {
            return true;
        } else {
            return false;
        }
    }

    lastPageIndex() {
        const lastPageElement = this.$('.PageNavigation .PageLink:last-child a')[0];
        if(!lastPageElement) return null;

        const href = new URL(lastPageElement.attribs.href);
        const lastPageIndex = Number(href.searchParams.get('currentpage'));
        return lastPageIndex;
    }
}

module.exports = ListPageHelper;