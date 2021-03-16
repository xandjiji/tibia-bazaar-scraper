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


}

module.exports = AuctionPageHelper;