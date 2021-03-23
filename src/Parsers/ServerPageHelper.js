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

    serverLocation() {
        const locationElement = this.$('td')[2];
        const serverLocation = locationElement.children[0].data;
        return serverLocation;
    }

    serverLocationObject() {
        const serverLocationText = this.serverLocation();

        switch (serverLocationText) {
            case 'Europe':
                return {
                    string: 'EU',
                    type: 0
                };

            case 'North America':
                return {
                    string: 'NA',
                    type: 1
                };

            case 'South America':
                return {
                    string: 'BR',
                    type: 2
                };

            default:
                return {
                    string: 'BR',
                    type: 2
                };
        }
    }

    pvpType() {
        const pvpElement = this.$('td')[3];
        const pvpType = pvpElement.children[0].data;
        return pvpType;
    }
}

module.exports = ServerPageHelper;