require('dotenv').config();
const mongoose = require('mongoose');

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        
        this.isConnected = false;
        Database.instance = this;
    }

    // Méthode pour se connecter à la base de données
    async connect() {
        if (this.isConnected) {
            return mongoose.connection;
        }

        try {
            await mongoose.connect(process.env.DB_URL);
            this.isConnected = true;
            console.log('✅ Connecté à MongoDB');
            return mongoose.connection;
        } catch (error) {
            console.error('❌ Erreur de connexion à MongoDB:', error);
            throw error;
        }
    }

    // Récupérer l'instance de la base de données
    getConnection() {
        if (!this.isConnected) {
            throw new Error('Base de données non connectée. Appelez connect() d\'abord.');
        }
        return mongoose.connection;
    }

    // Méthode pour se déconnecter
    async disconnect() {
        try {
            await mongoose.disconnect();
            this.isConnected = false;
            console.log('🔌 Déconnecté de MongoDB');
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
            throw error;
        }
    }
}

// Exporter une instance unique (Singleton)
module.exports = new Database();