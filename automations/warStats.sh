#!/bin/bash

cp ~/tibia-bazaar-scraper/Output/war/statistics.json ~/exevo-pan-war-data/

cd ~/exevo-pan-war-data/
git push origin --delete deploy
git branch -D deploy
git checkout -b deploy

git add .
git commit -m "`date`"
git push --set-upstream origin deploy
git checkout main
