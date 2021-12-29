#!/bin/bash
cd ~/tibia-bazaar-scraper/
yarn scrap:auctions
yarn update:highlighted

cp ~/tibia-bazaar-scraper/Output/ServerData.json ~/tibia-bazaar-scraper/Output/static
cp ~/tibia-bazaar-scraper/Output/ItemsData.json ~/tibia-bazaar-scraper/Output/static
cp ~/tibia-bazaar-scraper/Output/HighlightedAuctions.json ~/tibia-bazaar-scraper/Output/static
sh ~/tibia-bazaar-scraper/Output/static/deployStatic.sh

cp ~/tibia-bazaar-scraper/Output/CurrentAuctions.json ~/worker-exevopan/src/Data
cp ~/tibia-bazaar-scraper/Output/ServerData.json ~/worker-exevopan/src/Data
cp ~/tibia-bazaar-scraper/Output/ItemsData.json ~/worker-exevopan/src/Data

cd ~/worker-exevopan/
wrangler publish