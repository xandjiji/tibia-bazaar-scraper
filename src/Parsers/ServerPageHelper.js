const cheerio = require('cheerio');

class ServerPageHelper {
    setHtml($) {
        this.$ = $;
    }

    fetchError() {
        /* IMPLEMENT */
    }

    serverArray() {
        const tableElement = this.$('.Table3 .InnerTableContainer > table > tbody > tr:nth-child(3) .TableContent tr:not(.LabelH)');
        return tableElement;
    }

    serverName() {
        const linkElement = this.$('a')[0];
        const serverName = linkElement.children[0].data;
        return serverName;
    }


}

module.exports = ServerPageHelper;