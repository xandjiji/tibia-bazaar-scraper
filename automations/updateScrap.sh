#!/bin/bash

cd ~/tibia-bazaar-scraper/
npm run update

mv -v ~/tibia-bazaar-scraper/LatestCharacterData.json ~/exevo-pan-data/
mv -v ~/tibia-bazaar-scraper/ServerData.json ~/exevo-pan-data/
mv -v ~/tibia-bazaar-scraper/ItemsData.json ~/exevo-pan-data/

sh ~/deploy.sh