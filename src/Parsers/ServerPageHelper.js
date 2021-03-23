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

    pvpTypeObject() {
        const pvpTypeText = this.pvpType();

        switch (pvpTypeText) {
            case 'Optional PvP':
                return {
                    string: 'Optional',
                    type: 0
                };
    
            case 'Open PvP':
                return {
                    string: 'Open',
                    type: 1
                };
    
            case 'Retro Open PvP':
                return {
                    string: 'Retro Open',
                    type: 2
                };
    
            case 'Hardcore PvP':
                return {
                    string: 'Hardcore',
                    type: 3
                };
    
            case 'Retro Hardcore PvP':
                return {
                    string: 'Retro Hardcore',
                    type: 4
                };
    
            default:
                return {
                    string: 'Optional',
                    type: 0
                };
        }
    }

    battleye() {
        const battleyeElement = this.$('td')[4];

        if(!battleyeElement.children[0]) {
            return false;
        }

        const battleyeUrl = 'https://static.tibia.com/images/global/content/icon_battleyeinitial.gif';
        const battleyeElementUrl = battleyeElement.children[1].children[0].children[0].children[0].attribs.src;
        
        return (battleyeUrl === battleyeElementUrl);
    }

    experimental() {
        const serverName = this.serverName();
        return (serverName === 'Zuna' || serverName === 'Zunera');
    }
}

module.exports = ServerPageHelper;