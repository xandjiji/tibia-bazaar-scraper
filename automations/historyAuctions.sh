#!/bin/bash
cd ~/tibia-bazaar-scraper/
yarn scrap:history

cp ~/tibia-bazaar-scraper/Output/ServerData.json ~/history-server/src/Data
cp ~/tibia-bazaar-scraper/Output/HistoryAuctions.json ~/history-server/src/Data

cd ~/history-server/
yarn history:build
yarn history:start