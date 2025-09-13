#!/bin/bash

# Déclaration des projets et de leurs branches + noms PM2
declare -A projects
# projects["/root/section-app/site"]="main:main-section"
# projects["/root/section-app/backend"]="backend:backend-section"
projects["/root/section-app/admin"]="admin:admin-section"

echo "🔄 Déploiement global démarré à $(date)" | tee -a /var/log/deploy.log

for path in "${!projects[@]}"; do
  value=${projects[$path]}
  branch=${value%%:*}
  pm2Name=${value##*:}

  echo "📂 Mise à jour du projet: $path (branche $branch, pm2:$pm2Name)" | tee -a /var/log/deploy.log

  cd "$path" || { echo "❌ Impossible d'accéder à $path"; continue; }

  # Récupération du code
  git fetch origin $branch
  git checkout $branch
  git reset --hard origin/$branch

  # Installation des dépendances si Node.js
  if [ -f "package.json" ]; then
    echo "📦 Installation des dépendances..." | tee -a /var/log/deploy.log
    npm install --production
  fi

  # Build si Next.js
  if [ -f "next.config.js" ]; then
    echo "⚒️ Build Next.js..." | tee -a /var/log/deploy.log
    npm run build
  fi

  # Restart du process pm2
  echo "🔁 Redémarrage de $pm2Name avec pm2..." | tee -a /var/log/deploy.log
  pm2 restart "$pm2Name" || pm2 start "npm run start" --name "$pm2Name"
done

echo "✅ Déploiement terminé à $(date)" | tee -a /var/log/deploy.log
