#!/bin/bash
cd ~/tibia-bazaar-scraper/
yarn scrap:history

cp ~/tibia-bazaar-scraper/Output/ServerData.json ~/history-server/src/Data
cp ~/tibia-bazaar-scraper/Output/HistoryAuctions.jsonl ~/history-server/src/Data

pm2 restart HistoryServer