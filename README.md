## API BTP Sections

Application Express + MongoDB.

### Lancer l'application

```
npm install
npm start
```

Serveur par défaut sur `http://localhost:3000`.

### Authentification

Un agent se connecte via `POST /api/v1/user/agent/login` et reçoit un token JWT à placer dans l'en-tête:

```
Authorization: Bearer <token>
```

### Administration

Un administrateur est un enregistrement dans la collection `Admin` :

```json
{
	"userId": "<ObjectId d'un Agent>",
	"role": "admin",
	"quotite": 0
}
```

Schema : `models/Admin.js`

Middleware :
- `auth` : vérifie et décode le JWT, place l'agent dans `req.agent`.
- `isAdmin` : vérifie qu'un document Admin existe pour `req.agent.id`.

#### Endpoints Admin (`/api/v1/admin`)

| Méthode | URL | Protégé | Description |
|---------|-----|---------|-------------|
| GET | /me | auth | Retourne `{ isAdmin, admin }` pour l'utilisateur courant |
| GET | /check/:userId | auth + isAdmin | Vérifie si le userId est admin |
| POST | / | auth + isAdmin | Créer un admin (promotion d'un agent) |
| GET | / | auth + isAdmin | Liste des admins |
| GET | /:id | auth + isAdmin | Détails d'un admin |
| PUT | /:id | auth + isAdmin | Mise à jour rôle/quotité |
| DELETE | /:id | auth + isAdmin | Suppression d'un admin |

Note: Pour créer le tout premier admin, retirez temporairement `isAdmin` sur `POST /api/v1/admin/` ou insérez directement un document en base.

#### Vérifier si l'utilisateur courant est admin

```
GET /api/v1/admin/me
Authorization: Bearer <token>
```

Réponse:
```json
{ "isAdmin": true, "admin": { /* document */ } }
```

### Variables d'environnement

`.env` doit contenir :

```
DB_URL=mongodb+srv://...
```

### Tests manuels rapides (curl)

```bash
# Login agent
curl -X POST http://localhost:3000/api/v1/user/agent/login -H 'Content-Type: application/json' -d '{"matricule":"M001","password":"secret"}'

# Vérifier statut admin
curl http://localhost:3000/api/v1/admin/me -H 'Authorization: Bearer <TOKEN>'
```

