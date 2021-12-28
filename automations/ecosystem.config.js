const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60

module.exports = {
  apps: [
    {
      name: 'StaticData',
      cwd: '/home/xand/tibia-bazaar-scraper/Output/static',
      script: 'deployStatic.sh',
      autorestart: false,
      watch: true,
    },
    {
      name: 'Localtunnel',
      cwd: '/home/xand/tibia-bazaar-scraper/automations',
      script: 'localtunnel.sh',
    },
    {
      name: 'HistoryServer',
      cwd: '/home/xand/tibia-bazaar-scraper/automations',
      script: 'historyServer.sh',
    },
    {
      name: 'ScrapHistory',
      cwd: '/home/xand/tibia-bazaar-scraper/automations',
      script: 'scrapHistory.sh',
      restart_delay: HOUR * 4,
    },
    {
      name: 'ScrapAuctions',
      cwd: '/home/xand/tibia-bazaar-scraper/automations',
      script: 'scrapAuctions.sh',
      restart_delay: MINUTE * 5,
    },
  ],
}
