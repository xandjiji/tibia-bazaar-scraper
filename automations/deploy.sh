#!/bin/bash

cp ~/tibia-bazaar-scraper/Output/MinifiedCharacterData.json ~/exevo-pan-data/
cp ~/tibia-bazaar-scraper/Output/ServerData.json ~/exevo-pan-data/
cp ~/tibia-bazaar-scraper/Output/ItemsData.json ~/exevo-pan-data/

cd ~/exevo-pan-data/
git push origin --delete deploy
git branch -D deploy
git checkout -b deploy

git add .
git commit -m "`date`"
git push --set-upstream origin deploy
git checkout main