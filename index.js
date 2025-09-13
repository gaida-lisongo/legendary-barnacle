require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const port = 4001; // ✅ ton serveur webhook doit écouter ici

// Importer la base de données
const db = require('./service/Database');

// Importer les routes
const routes = require('./routes/index');

// Configuration CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route de base
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API BTP Sections - Bienvenue !',
    version: '1.0.0',
    endpoints: {
      sections: '/api/v1/section',
      health: '/health',
      webhook: '/webhook'
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

// Utiliser les routes API
app.use('/api/v1', routes);

//////////////////////////////////////////////////////////////
// ✅ Webhook GitHub
//////////////////////////////////////////////////////////////
const GITHUB_SECRET = process.env.GITHUB_SECRET || "mySuperSecretKey";

function verifySignature(req, res, next) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return res.status(401).send('Signature manquante');
  }

  const hmac = crypto.createHmac('sha256', GITHUB_SECRET);
  const digest = `sha256=${hmac.update(JSON.stringify(req.body)).digest('hex')}`;

  if (signature !== digest) {
    return res.status(403).send('Signature invalide');
  }

  next();
}

app.post('/webhook', verifySignature, (req, res) => {
  const payload = req.body;

  if (payload.ref === 'refs/heads/main') {
    console.log('📥 Push détecté sur main, lancement du déploiement...');

    exec('./deploy.sh', (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Erreur: ${error.message}`);
        return res.status(500).send('Erreur lors du déploiement');
      }
      console.log(`✅ stdout: ${stdout}`);
      console.error(`⚠️ stderr: ${stderr}`);
    });
  }
  console.log('✅ Webhook traité avec succès');
  res.json({ success: true, message: 'Webhook reçu', data: payload });
});

//////////////////////////////////////////////////////////////

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
    await db.connect();
    console.log(`🚀 Serveur webhook & API démarré sur le port ${port}`);
    console.log(`📍 API disponible sur http://localhost:${port}/api/v1`);
  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error);
    process.exit(1);
  }
});
