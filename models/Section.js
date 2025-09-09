const mongoose = require('mongoose');

// Sous-schémas pour une meilleure organisation
const offreSchema = new mongoose.Schema({
    icon: {
        type: String,
        required: true
    },
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const activitySchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    date_activity: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const calendrierSchema = new mongoose.Schema({
    annee: {
        type: String,
        required: true
    },
    current: {
        type: Boolean,
        default: false
    },
    activities: [activitySchema]
});

const alumnSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const eventSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: true
    },
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const galerySchema = new mongoose.Schema({
    annee: {
        type: String,
        required: true
    },
    current: {
        type: Boolean,
        default: false
    },
    events: [eventSchema]
});

const agendaEventSchema = new mongoose.Schema({
    date_event: {
        type: Date,
        required: true
    },
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const agendaSchema = new mongoose.Schema({
    annee: {
        type: String,
        required: true
    },
    current: {
        type: Boolean,
        default: false
    },
    events: [agendaEventSchema]
});

const missionSchema = new mongoose.Schema({
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const historySchema = new mongoose.Schema({
    date_event: {
        type: Date,
        required: true
    },
    titre: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const teamSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    fonction: {
        type: String,
        required: true
    }
});

// Schéma principal de la Section
const sectionSchema = new mongoose.Schema({
    description: {
        sigle: {
            type: String,
            required: true,
            unique: true
        },
        designation: {
            type: String,
            required: true
        },
        devise: {
            type: String,
            required: true
        },
        objectif: {
            type: String,
            required: true
        },
        images: [{
            type: String
        }],
        motChef: {
            photo: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    },
    offres: [offreSchema],
    calendrier: [calendrierSchema],
    alumni: [alumnSchema],
    galery: [galerySchema],
    agenda: [agendaSchema],
    missions: [missionSchema],
    history: [historySchema],
    team: [teamSchema],
    valeurs: [{
        type: String
    }],
    contact: {
        addresse: {
            type: String,
            required: true
        },
        telephone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
        },
        www: {
            type: String
        }
    }
}, {
    timestamps: true // Ajoute createdAt et updatedAt automatiquement
});

// Index pour améliorer les performances de recherche
sectionSchema.index({ 'description.sigle': 1 });
sectionSchema.index({ 'description.designation': 1 });

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;