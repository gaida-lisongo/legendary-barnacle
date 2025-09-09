require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Importer la base de données
const db = require('./service/Database');

// Importer les routes
const routes = require('./routes/index');

// Configuration CORS corrigée
const corsOptions = {
  origin: '*', // Pas de tableau pour '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false // False quand origin est '*'
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de base - retourne du JSON
app.get('/', (req, res) => {
  console.log(process.env.DB_URL);
  res.json({
    success: true,
    message: 'API BTP Sections - Bienvenue !',
    version: '1.0.0',
    endpoints: {
      sections: '/api/v1/section',
      health: '/health'
    }
  });
});

// Route de santé
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Serveur en ligne',
    timestamp: new Date().toISOString(),
    database: db.isConnected() ? 'connectée' : 'déconnectée'
  });
});

// Utiliser toutes les routes sous /api/v1
app.use('/api/v1', routes);

// Middleware pour gérer les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

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
