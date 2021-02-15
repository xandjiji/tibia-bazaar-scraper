#!/bin/bash

cd ~/tibia-bazaar-scraper/
npm run update

cp ~/tibia-bazaar-scraper/LatestCharacterData.json ~/exevo-pan-data/
cp ~/tibia-bazaar-scraper/ServerData.json ~/exevo-pan-data/
cp ~/tibia-bazaar-scraper/ItemsData.json ~/exevo-pan-data/

sh ~/deploy.sh