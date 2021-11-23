#!/bin/bash

cd /root/worker-exevopan
pm2 delete historyServer
npm run history:build
pm2 start npm --name historyServer -- run history:start