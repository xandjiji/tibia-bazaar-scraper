#!/bin/bash

cd ~/tibia-bazaar-scraper/
npm run update

mv -v ~/tibia-bazaar-scraper/LatestCharacterData.json ~/exevo-pan/src/
mv -v ~/tibia-bazaar-scraper/serverData.json ~/exevo-pan/src/
mv -v ~/tibia-bazaar-scraper/ItemsData.json ~/exevo-pan/src/

sh ~/deploy.sh