#!/bin/bash

cd ~/exevo-pan/
npm run build

rm -R ~/exevo-pan-deploy/static/
rm -R ~/exevo-pan-deploy/icons/
mv -v ~/exevo-pan/build/* ~/exevo-pan-deploy/

cd ~/exevo-pan-deploy
git add .
git commit -m "new build"
git push