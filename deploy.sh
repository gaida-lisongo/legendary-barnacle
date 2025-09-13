#!/bin/bash
# ----------------------------------------
# Script de déploiement automatique
# Compatible Next.js et Node.js
# PM2 + logs centralisés
# ----------------------------------------

# Chemin du log (dans le même dossier que le script)
LOG_FILE="$(dirname "$0")/deploy.log"

# Déclaration des projets : chemin → branche:nom_pm2
declare -A projects
# projects["/var/www/site"]="main:site-section"
# projects["/var/www/backend"]="backend:backend-section"
projects["/root/section-app/admin"]="admin:admin-section"

echo "🔄 Déploiement global démarré à $(date)" | tee -a "$LOG_FILE"

# Boucle sur tous les projets
for path in "${!projects[@]}"; do
    value=${projects[$path]}
    branch=${value%%:*}
    pm2Name=${value##*:}

    echo "📂 Mise à jour du projet: $path (branche $branch, pm2:$pm2Name)" | tee -a "$LOG_FILE"

    # Aller dans le dossier du projet
    cd "$path" || { echo "❌ Impossible d'accéder à $path"; continue; }

    # Récupération du code depuis GitHub
    echo "⬇️  Pull dernière version depuis GitHub..." | tee -a "$LOG_FILE"
    git fetch origin "$branch" >> "$LOG_FILE" 2>&1
    git checkout "$branch" >> "$LOG_FILE" 2>&1
    git reset --hard "origin/$branch" >> "$LOG_FILE" 2>&1

    # Installer les dépendances Node.js si package.json présent
    if [ -f "package.json" ]; then
        echo "📦 Installation des dépendances..." | tee -a "$LOG_FILE"
        npm install --production >> "$LOG_FILE" 2>&1
    fi

    # Build si projet Next.js (présence de next.config.js)
    if [ -f "next.config.js" ]; then
        echo "⚒️ Build Next.js..." | tee -a "$LOG_FILE"
        npm run build >> "$LOG_FILE" 2>&1
    fi

    # Redémarrage PM2
    echo "🔁 Redémarrage du service $pm2Name avec PM2..." | tee -a "$LOG_FILE"
    pm2 restart "$pm2Name" >> "$LOG_FILE" 2>&1 || pm2 start "npm run start" --name "$pm2Name" >> "$LOG_FILE" 2>&1

    echo "✅ Projet $pm2Name déployé avec succès !" | tee -a "$LOG_FILE"
done

echo "🎉 Déploiement global terminé à $(date)" | tee -a "$LOG_FILE"
