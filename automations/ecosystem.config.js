const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60

module.exports = {
  apps: [
    /* {
      name: 'scrap:history',
      cwd: '/home/xand/tibia-bazaar-scraper',
      script: 'yarn',
      args: 'scrap:history',
      restart_delay: HOUR * 4,
    }, */
    {
      name: 'scrap:auctions',
      cwd: '/home/xand/tibia-bazaar-scraper/automations',
      script: 'currentAuctions.sh',
      restart_delay: MINUTE * 5,
    },
  ],
}
