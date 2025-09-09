require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

// Importer la base de données
const db = require('./service/Database');

// Importer les routes
const routes = require('./routes/index');

// Middleware pour parser le JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de base
app.get('/', (req, res) => {
  console.log(process.env.DB_URL);
  res.send('Hello World !');
});

// Utiliser toutes les routes sous /api/v1
app.use('/api/v1', routes);

// Démarrer le serveur
app.listen(port, async () => {
  try {
    // Se connecter à la base de données
    await db.connect();
    console.log(`🚀 Serveur démarré sur le port ${port}`);
    console.log(`📍 API disponible sur http://localhost:${port}/api/v1`);
  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error);
    process.exit(1);
  }
});
