# 🚀 French Project Management Dashboard

Tableau de bord professionnel de gestion de projets français avec intégration Airtable et authentification à deux rôles (Admin & Directeur).

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![Airtable Integration](https://img.shields.io/badge/Airtable-Integrated-blue)
![Auth](https://img.shields.io/badge/Auth-Admin%20%26%20Directeur-orange)

---

## ✨ Fonctionnalités

- 🔐 **Authentification** - 2 rôles (Admin CRUD complet, Directeur lecture seule)
- 📊 **Dashboard** - KPIs, graphiques circulaires, statistiques en temps réel
- 📋 **Kanban Board** - 9 colonnes de statut, drag & drop visuel
- 📅 **Timeline/Gantt** - Chronologie visuelle des projets
- 🗄️ **Airtable Integration** - Gère vos 78 projets réels avec colonnes françaises
- 💾 **CRUD Complet** - Créer, lire, modifier, supprimer (Admin uniquement)
- 🎨 **Design Moderne** - Tailwind CSS v4, composants accessibles
- 🌐 **Production Ready** - Déployable immédiatement sur Vercel/Netlify

---

## 🚀 Quick Start

### Configuration Initiale

1. **Créez `.env.local`:**

```bash
# AIRTABLE
VITE_AIRTABLE_API_KEY=your_api_key_here
VITE_AIRTABLE_BASE_ID=your_base_id_here
VITE_AIRTABLE_TABLE_NAME=Projects

# ADMIN
VITE_ADMIN_EMAIL=Rahima.kone@cgi.ci
VITE_ADMIN_PASSWORD=Rqpx03!21DPGS
VITE_ADMIN_NAME=Rahima Kone

# DIRECTEURS (séparés par des virgules)
VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com,marie.ayoman@quipux.com
VITE_DIRECTEUR_PASSWORDS=YourPassword1,YourPassword2
VITE_DIRECTEUR_NAMES=Ibrahima Kone,Marie Ayoman
```

2. **Démarrez:**

```bash
npm install
npm run dev
```

**📖 Guide complet:** Voir [`SETUP_INSTRUCTIONS.md`](./SETUP_INSTRUCTIONS.md)

---

## 📚 Documentation

### Configuration & Setup
- **[SETUP_INSTRUCTIONS.md](./SETUP_INSTRUCTIONS.md)** - ⭐ Configuration complète étape par étape
- **[CREDENTIALS_REFERENCE.md](./CREDENTIALS_REFERENCE.md)** - 🔑 Référence des identifiants (confidentiel)
- **[.env.local.example](./.env.local.example)** - Template de configuration

### Guides Utilisateur
- **[QUICK_START.md](./QUICK_START.md)** - Installation rapide
- **[AIRTABLE_SETUP_GUIDE.md](./AIRTABLE_SETUP_GUIDE.md)** - Configuration Airtable détaillée

### Documentation Technique
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture complète du système
- **[FEATURES_SUMMARY.md](./FEATURES_SUMMARY.md)** - Vue d'ensemble des fonctionnalités
- **[CHANGELOG.md](./CHANGELOG.md)** - Historique des versions

---

## 🔑 Comptes Configurés

### Administrateur (Full CRUD)
- **Email:** Rahima.kone@cgi.ci
- **Mot de passe:** Rqpx03!21DPGS
- **Permissions:** Créer, modifier, supprimer tous les projets

### Directeurs (Lecture seule)
1. **Ibrahima Kone** - ibrahima.kone@quipux.com
2. **Marie Ayoman** - marie.ayoman@quipux.com

> 💡 Définissez les mots de passe des directeurs dans `.env.local`  
> 📖 Voir `SETUP_INSTRUCTIONS.md` pour ajouter d'autres directeurs

---

## 🏗️ Architecture

```
React App + Airtable + Authentication
├── Login Screen (admin ou directeur)
├── Dashboard (KPIs + Charts)
├── Kanban Board (9 status columns)
├── Timeline/Gantt (visual timeline)
└── Project Modal (CRUD form)

Data Flow:
1. User logs in → AuthContext stores user + role
2. App fetches projects → Airtable API → ProjectsContext
3. Admin can CRUD → Updates Airtable + local state
4. Directeur can view → All forms disabled
```

**📖 Architecture détaillée:** Voir [`ARCHITECTURE.md`](./ARCHITECTURE.md)

---

## 📊 Structure Airtable

### Table "Projects" - Champs Requis

| Champ | Type | Exemple |
|-------|------|---------|
| name | Single line text | "Deployment Cloud" |
| department | Single select | DSI, DAF, RH, DGP, DDEV |
| status | Single select | 9 options (voir ci-dessous) |
| priority | Single select | Haute, Moyenne, Basse |
| progress | Number | 75 |
| projectManager | Single line text | "Sophie Martin" |
| partners | Long text | "IT Team, Microsoft" |
| startDate | Date | 2026-01-15 |
| endDate | Date | 2026-03-30 |
| comments | Long text | "Notes du projet..." |
| isDelayed | Checkbox | ☑ / ☐ |

### 9 Statuts Disponibles

1. Non démarré
2. En étude
3. En exécution
4. En attente de Go pour production
5. En production
6. En service
7. En pause
8. Clôturé
9. Abandonné

**📖 Configuration complète:** Voir [`AIRTABLE_SETUP_GUIDE.md`](./AIRTABLE_SETUP_GUIDE.md)

---

## 🎨 Captures d'Écran

### Dashboard avec KPIs
- 3 cartes KPI (Projets actifs, En retard, Avancement moyen)
- Graphique circulaire de répartition des statuts
- Tableau des projets récents

### Kanban Board
- 9 colonnes pour chaque statut
- Cartes de projet avec badges département/priorité
- Barre de progression sur chaque carte
- Click pour modifier (Admin) ou voir (Directeur)

### Timeline/Gantt
- Vue chronologique par département
- Barres colorées par statut
- Filtres département et statut
- Timeline de 4 mois (Janvier-Avril 2026)

### Authentification
- Page de login sécurisée
- Badge de rôle (Admin/Directeur)
- Bouton déconnexion
- Session persistante

---

## 🛠️ Technologies

**Frontend:**
- React 18 + TypeScript
- Tailwind CSS v4
- React Router (data mode)
- Vite

**UI Components:**
- shadcn/ui (Radix UI)
- Recharts (graphiques)
- Lucide React (icônes)
- Sonner (toasts)

**Backend:**
- Airtable API (base de données)
- localStorage (session)

**Deployment:**
- Vercel (recommandé)
- Netlify
- Docker (optional)

---

## 🚀 Déploiement

### Vercel (Recommandé)

1. Push sur GitHub
2. Importez sur Vercel
3. Ajoutez les variables d'environnement:
   - `VITE_AIRTABLE_API_KEY`
   - `VITE_AIRTABLE_BASE_ID`
   - `VITE_AIRTABLE_TABLE_NAME`
4. Déployez!

**URL:** `https://votre-projet.vercel.app`

### Netlify

Même processus:
1. Connectez GitHub
2. Ajoutez variables dans Settings → Environment
3. Déployez

---

## 🔐 Sécurité

### ⚠️ Authentification Actuelle

**Simplifiée pour démonstration:**
- Email/password simple
- localStorage pour session
- Pas de hashage de mot de passe

**Idéal pour:**
- ✅ Démonstration interne
- ✅ Prototype rapide
- ✅ Environnement de test

### 🔒 Pour la Production

**Recommandations:**

1. **Utilisez Supabase Authentication:**
   - Authentification sécurisée
   - JWT tokens
   - Gestion complète des utilisateurs
   - Reset password, email verification

2. **Ou implémentez:**
   - Hashage bcrypt des mots de passe
   - Sessions côté serveur
   - HTTPS obligatoire
   - Protection CSRF

3. **Variables d'environnement:**
   - ❌ Jamais dans le code
   - ✅ Toujours dans `.env.local`
   - ✅ Variables serveur en production

---

## 📦 Installation

```bash
# Clone le projet
git clone [your-repo-url]
cd french-pm-dashboard

# Installez les dépendances
npm install

# Configurez Airtable (optionnel)
cp .env.local.example .env.local
# Éditez .env.local avec vos clés

# Démarrez en mode dev
npm run dev

# Build pour production
npm run build

# Preview du build
npm run preview
```

---

## 🎯 Cas d'Usage

### 1. Direction des Systèmes d'Information (DSI)
- Suivi de 78 projets IT
- Dashboard pour directeurs (lecture seule)
- Gestion complète pour chefs de projet (admin)

### 2. Démonstration Client
- Mode démo avec données de test
- Bascule rapide admin/directeur
- Présentation des fonctionnalités

### 3. Multi-Départements
- 5 départements (DSI, DAF, RH, DGP, DDEV)
- Vue centralisée des projets
- Filtres par département

---

## 🛠️ Personnalisation

### Changer les Couleurs

Modifiez `/styles/globals.css`:

```css
:root {
  --color-primary: #3B82F6;
  --color-success: #10B981;
  --color-danger: #EF4444;
}
```

### Ajouter un Statut

1. Ajoutez dans `/types/project.ts`
2. Ajoutez la couleur dans `statusColors`
3. Ajoutez l'option dans Airtable

### Ajouter un Rôle

1. Modifiez `/types/user.ts`
2. Ajoutez l'utilisateur dans `/services/auth.ts`
3. Gérez les permissions dans les composants

**📖 Guide complet:** Voir [`AIRTABLE_AUTH_README.md`](./AIRTABLE_AUTH_README.md)

---

## 🐛 Dépannage

### Erreur "Airtable non configuré"
1. Vérifiez `.env.local` existe
2. Redémarrez le serveur
3. Vérifiez `VITE_` au début des variables

### Erreur 401 Unauthorized
1. Régénérez le token API Airtable
2. Vérifiez les permissions (read + write)
3. Copiez le token sans espaces

### Projects ne chargent pas
1. Vérifiez le Base ID (commence par `app`)
2. Vérifiez le nom de table (sensible à la casse)
3. Ouvrez la console (F12) pour voir les erreurs

**📖 Dépannage complet:** Voir [`AIRTABLE_SETUP_GUIDE.md`](./AIRTABLE_SETUP_GUIDE.md) section 6

---

## 📖 Scripts Disponibles

```bash
# Développement
npm run dev          # Démarre le serveur de dev (port 5173)

# Build
npm run build        # Build de production
npm run preview      # Preview du build local

# Qualité
npm run lint         # Linter ESLint
npm run type-check   # TypeScript type checking
```

---

## 🤝 Support

### Besoin d'aide?

1. **Lisez la documentation:**
   - [`QUICK_START.md`](./QUICK_START.md) - Installation rapide
   - [`AIRTABLE_SETUP_GUIDE.md`](./AIRTABLE_SETUP_GUIDE.md) - Configuration Airtable
   - [`ARCHITECTURE.md`](./ARCHITECTURE.md) - Architecture détaillée

2. **Debugging:**
   - Ouvrez la console (F12)
   - Cherchez les erreurs réseau
   - Vérifiez les logs du serveur

3. **Questions fréquentes:**
   - Voir section "Dépannage" dans [`AIRTABLE_SETUP_GUIDE.md`](./AIRTABLE_SETUP_GUIDE.md)

---

## 📄 Licence

MIT License - Utilisez librement pour vos projets personnels et commerciaux!

---

## 🎉 Prochaines Étapes

Après l'installation:

1. ✅ **Testez** les deux rôles (Admin & Directeur)
2. ✅ **Configurez** Airtable avec vos 78 projets
3. ✅ **Personnalisez** les identifiants de connexion
4. ✅ **Ajoutez** vos propres projets
5. ✅ **Déployez** sur Vercel ou Netlify

---

## 🚀 Commencez Maintenant

```bash
# Installation immédiate (mode démo)
npm install && npm run dev
```

**Ouvrez:** http://localhost:5173/login  
**Login:** admin@entreprise.fr / admin123

**Profitez du dashboard! 🎊**

---

**Made with ❤️ for French project management teams**