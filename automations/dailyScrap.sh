#!/bin/bash

cd ~/tibia-bazaar-scraper/
rm ItemsData.json
rm ServerData.json
rm bazaarPages.json
rm AllCharacterData.json
rm LatestCharacterData.json

npm run scrap

sh ~/updateScrap.sh