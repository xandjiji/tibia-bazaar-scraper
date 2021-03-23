#!/bin/bash

cd ~/tibia-bazaar-scraper/
npm run update

cp ~/tibia-bazaar-scraper/Output/MinifiedCharacterData.json ~/exevo-pan-data/
cp ~/tibia-bazaar-scraper/Output/ServerData.json ~/exevo-pan-data/
cp ~/tibia-bazaar-scraper/Output/ItemsData.json ~/exevo-pan-data/

sh ~/deploy.sh