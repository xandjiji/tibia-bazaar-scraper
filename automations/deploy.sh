#!/bin/bash

cd ~/exevo-pan-data/
git checkout main
git push origin --delete deploy
git branch -D deploy
git checkout -b deploy

git add .
git commit -m "`date`"
git push --set-upstream origin deploy