#!/bin/bash

cd ~/tibia-bazaar-scraper/
yarn update:statistics

cp ~/tibia-bazaar-scraper/Output/HistoryStatistics.json ~/exevo-pan-history-data/
cp ~/tibia-bazaar-scraper/Output/overallStatistics.json ~/exevo-pan-history-data/

cd ~/exevo-pan-history-data/
git push origin --delete deploy
git branch -D deploy
git checkout -b deploy

git add .
git commit -m "`date`"
git push --set-upstream origin deploy
git checkout main