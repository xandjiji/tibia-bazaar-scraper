const { dateParsing } = require('../utils');

class AuctionPageHelper {
    constructor($) {
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
        return id;
    }

    nickname() {
        return this.$('.Auction .AuctionCharacterName').text();
    }

    auctionEnd() {
        const timestampElement = this.$('.AuctionTimer')[0];

        if(timestampElement) {
            const timestamp = timestampElement.attribs['data-timestamp'];
            return timestamp;
        }

        const auctionEndElement = this.$('.ShortAuctionDataValue');
        const auctionEnd = dateParsing(auctionEndElement[1].children[0].data);
        return auctionEnd;
    }


}

module.exports = AuctionPageHelper;