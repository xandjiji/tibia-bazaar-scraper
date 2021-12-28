#!/bin/bash

cd ~/tibia-bazaar-scraper/
yarn update:statistics

cp ~/tibia-bazaar-scraper/Output/HistoryStatistics.json ~/tibia-bazaar-scraper/Output/static
sh ~/tibia-bazaar-scraper/Output/static/deployStatic.sh

# remove this after deploy:
cp ~/tibia-bazaar-scraper/Output/overallStatistics.json ~/exevo-pan-history-data/

# remove this after deploy:
cd ~/exevo-pan-history-data/
git push origin --delete deploy
git branch -D deploy
git checkout -b deploy

# remove this after deploy:
git add .
git commit -m "`date`"
git push --set-upstream origin deploy
git checkout main