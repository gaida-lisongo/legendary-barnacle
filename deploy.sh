#!/bin/bash

#!/bin/bash
# cd /var/www/site
# git checkout main
# git pull origin main
# npm install
# pm2 restart site-section || pm2 start index.js --name site-section

# cd /var/www/backend
# git checkout backend
# git pull origin backend
# npm install
# pm2 restart backend-section || pm2 start index.js --name backend-section

cd /root/section-app/admin
git checkout admin
git pull origin admin
npm run build
pm2 restart admin-section