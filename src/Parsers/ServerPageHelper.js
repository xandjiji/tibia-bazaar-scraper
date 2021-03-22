const cheerio = require('cheerio');

class ServerPageHelper {
    setHtml($) {
        this.$ = $;
    }

    fetchError() {
        /* IMPLEMENT */
    }

    serverArray() {
        const tableElement = this.$('.TableContent tbody')[2];
        tableElement.children.shift();
        tableElement.children.pop();

        return tableElement.children;
    }


}

module.exports = ServerPageHelper;