#!/bin/bash

rm -R -f ~/exevo-pan-deploy
cd ~/
git clone --depth=1 --single-branch --branch deploy git@github.com:xandjiji/exevo-pan-deploy.git