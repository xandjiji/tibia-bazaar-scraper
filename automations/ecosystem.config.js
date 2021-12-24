const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60

module.exports = {
  apps: [
    /* {
      name: 'History Auctions',
      cwd: '/home/xand/tibia-bazaar-scraper',
      script: 'historyAuctions',
      restart_delay: HOUR * 4,
    }, */
    {
      name: 'Current Auctions',
      cwd: '/home/xand/tibia-bazaar-scraper/automations',
      script: 'currentAuctions.sh',
      restart_delay: MINUTE * 5,
    },
  ],
}
