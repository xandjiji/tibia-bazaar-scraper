#!/bin/bash

cd /root/worker-exevopan
pm2 delete historyServer
pm2 start npm --name historyServer -- run history:start