#!/bin/bash

cd ~/tibia-bazaar-scraper/
yarn update:statistics

cp ~/tibia-bazaar-scraper/Output/HistoryStatistics.json ~/tibia-bazaar-scraper/Output/static
sh ~/tibia-bazaar-scraper/Output/static/deployStatic.sh
