class AuctionPageHelper {
    constructor($) {
        this.$ = $;
    }

    fetchError() {
        
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
}

module.exports = AuctionPageHelper;