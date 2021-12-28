#!/bin/bash
cd ~/tibia-bazaar-scraper/
yarn scrap:auctions
yarn update:highlighted

cp ~/tibia-bazaar-scraper/Output/ServerData.json ~/tibia-bazaar-scraper/Output/static
cp ~/tibia-bazaar-scraper/Output/ItemsData.json ~/tibia-bazaar-scraper/Output/static
cp ~/tibia-bazaar-scraper/Output/HighlightedAuctions.json ~/tibia-bazaar-scraper/Output/static
sh ~/tibia-bazaar-scraper/Output/static/deployStatic.sh

# remove this after deploy:
cp ~/tibia-bazaar-scraper/Output/ServerData.json ~/exevo-pan-data/
cp ~/tibia-bazaar-scraper/Output/ItemsData.json ~/exevo-pan-data/
cp ~/tibia-bazaar-scraper/Output/HighlightedAuctions.json ~/exevo-pan-data/

# remove this after deploy:
cd ~/exevo-pan-data/
git push origin --delete deploy
git branch -D deploy
git checkout -b deploy

# remove this after deploy:
git add .
git commit -m "`date`"
git push --set-upstream origin deploy
git checkout main

cp ~/tibia-bazaar-scraper/Output/CurrentAuctions.json ~/worker-exevopan/src/Data
cp ~/tibia-bazaar-scraper/Output/ServerData.json ~/worker-exevopan/src/Data
cp ~/tibia-bazaar-scraper/Output/ItemsData.json ~/worker-exevopan/src/Data

cd ~/worker-exevopan/
wrangler publish