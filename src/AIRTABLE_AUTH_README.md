# 🚀 French Project Management Dashboard - Airtable + Authentication

Tableau de bord professionnel de gestion de projets français avec intégration Airtable et authentification à deux rôles.

---

## ✨ Fonctionnalités

### 🔐 Authentification
- **2 rôles:** Admin (CRUD complet) et Directeur (lecture seule)
- **Login sécurisé** avec email et mot de passe
- **Session persistante** (stockage local)
- **Protection des routes** (redirection automatique)

### 📊 Gestion de Projets
- **Connexion Airtable** pour données réelles (78 projets)
- **Fallback automatique** aux données de test si non configuré
- **4 écrans:**
  - Dashboard (KPIs + graphique circulaire)
  - Kanban (9 colonnes de statut)
  - Timeline/Gantt (chronologie visuelle)
  - Modal CRUD (formulaire de projet)

### 🎨 Interface Professionnelle
- **Design moderne** en Tailwind CSS v4
- **Composants accessibles** (shadcn/ui + Radix UI)
- **Responsive** (optimisé desktop 1280px+)
- **Toasts** pour feedback utilisateur (Sonner)
- **Loading states** pendant chargement Airtable

### 🔒 Contrôle d'Accès
- **Admin:**
  - ✅ Créer des projets
  - ✅ Modifier des projets
  - ✅ Supprimer des projets
  - ✅ Accès complet

- **Directeur:**
  - ✅ Voir tous les projets
  - ✅ Voir toutes les statistiques
  - ❌ Pas de création
  - ❌ Pas de modification
  - ❌ Pas de suppression

---

## 🏗️ Architecture

```
/
├── services/
│   ├── airtable.ts          # API Airtable (CRUD)
│   └── auth.ts              # Authentification simple
├── contexts/
│   ├── AuthContext.tsx      # État d'authentification
│   └── ProjectsContext.tsx  # Gestion des projets
├── components/
│   ├── screens/
│   │   ├── Login.tsx        # Page de connexion
│   │   ├── DashboardOverview.tsx
│   │   ├── ProjectsKanban.tsx
│   │   └── TimelineGantt.tsx
│   ├── ProtectedRoute.tsx   # Protection des routes
│   ├── TopNavigation.tsx    # Barre de navigation
│   └── ProjectModal.tsx     # Formulaire CRUD
├── types/
│   ├── project.ts           # Types de projets
│   └── user.ts              # Types d'utilisateurs
└── routes.ts                # Configuration routes
```

---

## 🚀 Installation Rapide

### 1. Installer les Dépendances

```bash
npm install
```

### 2. Configurer Airtable

Créez un fichier `.env.local` à la racine:

```bash
# AIRTABLE
VITE_AIRTABLE_API_KEY=pat...
VITE_AIRTABLE_BASE_ID=app...
VITE_AIRTABLE_TABLE_NAME=Projects

# AUTHENTICATION (optionnel)
VITE_ADMIN_EMAIL=admin@entreprise.fr
VITE_ADMIN_PASSWORD=admin123
VITE_DIRECTEUR_EMAIL=directeur@entreprise.fr
VITE_DIRECTEUR_PASSWORD=directeur123
```

**📖 Guide détaillé:** Voir `AIRTABLE_SETUP_GUIDE.md`

### 3. Structure de Table Airtable

Créez une table "Projects" avec ces champs:

| Champ | Type | Options |
|-------|------|---------|
| name | Single line text | - |
| department | Single select | DSI, DAF, RH, DGP, DDEV |
| status | Single select | 9 options (voir guide) |
| priority | Single select | Haute, Moyenne, Basse |
| progress | Number | 0-100 |
| projectManager | Single line text | - |
| partners | Long text | - |
| startDate | Date | - |
| endDate | Date | - |
| comments | Long text | - |
| isDelayed | Checkbox | - |

### 4. Lancer l'Application

```bash
npm run dev
```

Ouvrez: **http://localhost:5173/login**

---

## 🔑 Comptes par Défaut

### Administrateur
- **Email:** `admin@entreprise.fr`
- **Mot de passe:** `admin123`
- **Permissions:** Création, lecture, modification, suppression

### Directeur
- **Email:** `directeur@entreprise.fr`
- **Mot de passe:** `directeur123`
- **Permissions:** Lecture seule

> 💡 **Astuce:** Modifiez les identifiants dans `.env.local`

---

## 📱 Utilisation

### Mode Admin

1. **Connectez-vous** avec le compte admin
2. **Créez des projets** (bouton "Ajouter un Nouveau Projet")
3. **Modifiez des projets** (cliquez sur n'importe quel projet)
4. **Supprimez des projets** (bouton dans le modal)
5. **Naviguez** entre Dashboard, Kanban, et Timeline

### Mode Directeur

1. **Connectez-vous** avec le compte directeur
2. **Consultez** tous les projets et statistiques
3. **Visualisez** le Kanban et la Timeline
4. **Aucune modification** n'est possible
5. **Bannières bleues** indiquent le mode lecture seule

### Mode Démonstration (sans Airtable)

Si Airtable n'est pas configuré:
- ⚠️ **Bannière jaune** s'affiche
- ℹ️ **12 projets de test** sont utilisés
- ✅ **Toutes les fonctionnalités** fonctionnent
- ❌ **Modifications non sauvegardées** (mémoire seulement)

---

## 🔧 Intégration Airtable

### Opérations CRUD

**Create (Créer):**
```typescript
import { createProject } from './services/airtable';
await createProject({
  name: "Nouveau Projet",
  department: "DSI",
  // ... autres champs
});
```

**Read (Lire):**
```typescript
import { fetchProjects } from './services/airtable';
const projects = await fetchProjects(); // Tous les projets
```

**Update (Modifier):**
```typescript
import { updateProject } from './services/airtable';
await updateProject(projectId, {
  status: "En production",
  progress: 75,
});
```

**Delete (Supprimer):**
```typescript
import { deleteProject } from './services/airtable';
await deleteProject(projectId);
```

### Gestion Automatique

L'application gère automatiquement:
- ✅ **Pagination** (récupère tous les projets)
- ✅ **Erreurs** (affiche toasts, fallback aux données de test)
- ✅ **Loading states** (spinners pendant chargement)
- ✅ **Mode hors ligne** (utilise données de test)

---

## 🎯 Cas d'Usage

### Scénario 1: Entreprise avec 78 Projets

1. **Importez vos projets** dans Airtable
2. **Configurez** `.env.local` avec vos clés
3. **Lancez l'application**
4. **Tous vos projets** s'affichent automatiquement
5. **Gérez-les** via l'interface

### Scénario 2: Démonstration Rapide

1. **Ne configurez pas** Airtable
2. **Lancez l'application**
3. **12 projets de test** s'affichent
4. **Testez toutes les fonctionnalités**

### Scénario 3: Équipe Mixte

1. **Créez des comptes** Admin et Directeur
2. **Admin** gère les projets
3. **Directeurs** consultent uniquement
4. **Permissions automatiques** selon le rôle

---

## 🚀 Déploiement

### Option 1: Vercel (Recommandé)

```bash
# 1. Poussez sur GitHub
git push origin main

# 2. Importez sur Vercel
# - Connectez votre repo GitHub
# - Ajoutez les variables d'environnement
# - Déployez!
```

**Variables d'environnement Vercel:**
- `VITE_AIRTABLE_API_KEY`
- `VITE_AIRTABLE_BASE_ID`
- `VITE_AIRTABLE_TABLE_NAME`
- Identifiants d'authentification

### Option 2: Netlify

```bash
# 1. Connectez votre repo
# 2. Ajoutez les variables dans Settings > Environment
# 3. Déployez
```

### Option 3: Docker (Avancé)

```bash
# Build
docker build -t french-pm-dashboard .

# Run
docker run -p 3000:3000 \
  -e VITE_AIRTABLE_API_KEY=your_key \
  -e VITE_AIRTABLE_BASE_ID=your_base \
  french-pm-dashboard
```

---

## 🔐 Sécurité

### ⚠️ Important

**L'authentification actuelle est SIMPLIFIÉE pour la démonstration.**

Pour la production:
1. **Utilisez Supabase Authentication**
   - Authentification sécurisée
   - JWT tokens
   - Gestion des sessions
   - Réinitialisation mot de passe

2. **Ou créez une table Users dans Airtable**
   - Hashage des mots de passe (bcrypt)
   - Tokens de session sécurisés
   - Validation côté serveur

3. **Variables d'environnement**
   - ❌ Jamais de clés API dans le code
   - ✅ Toujours dans `.env.local`
   - ✅ Variables d'environnement du serveur en production

---

## 🛠️ Dépannage

### Problème: "Airtable non configuré"

**Solution:**
1. Vérifiez que `.env.local` existe
2. Redémarrez le serveur (`npm run dev`)
3. Vérifiez les noms des variables (`VITE_` au début)

### Problème: "Erreur 401"

**Solution:**
1. Régénérez votre token API Airtable
2. Vérifiez les permissions (read + write)
3. Copiez le token sans espaces

### Problème: Login ne fonctionne pas

**Solution:**
1. Vérifiez les identifiants dans `.env.local`
2. Essayez les identifiants par défaut
3. Videz le cache navigateur (F12 > Application > Clear storage)

### Problème: Projets ne se chargent pas

**Solution:**
1. Ouvrez la console (F12)
2. Cherchez les erreurs réseau
3. Vérifiez le Base ID et Table Name
4. Testez l'API Airtable directement

**📖 Guide complet:** Voir `AIRTABLE_SETUP_GUIDE.md`

---

## 📚 Documentation Complète

- **`AIRTABLE_SETUP_GUIDE.md`** - Configuration Airtable détaillée
- **`WEWEB_EXPORT_GUIDE.md`** - Export vers WeWeb (si besoin)
- **`EXPORT_CHECKLIST.md`** - Checklist d'export
- **`.env.local.example`** - Template de configuration

---

## 🎨 Personnalisation

### Changer les Couleurs

Modifiez `/styles/globals.css`:

```css
:root {
  --color-primary: #3B82F6;  /* Bleu principal */
  --color-success: #10B981;  /* Vert */
  --color-danger: #EF4444;   /* Rouge */
}
```

### Ajouter un Nouveau Statut

1. Ajoutez dans `/types/project.ts`:
```typescript
export type Status = 
  | "..." 
  | "Nouveau Statut";
```

2. Ajoutez la couleur:
```typescript
export const statusColors = {
  "Nouveau Statut": "#FF6B6B",
};
```

3. Ajoutez dans Airtable (champ status)

### Ajouter un Nouveau Rôle

1. Modifiez `/types/user.ts`:
```typescript
export type UserRole = "admin" | "directeur" | "chef_projet";
```

2. Ajoutez dans `/services/auth.ts`:
```typescript
{
  id: "3",
  email: "chef@entreprise.fr",
  password: "chef123",
  name: "Chef de Projet",
  role: "chef_projet",
}
```

3. Gérez les permissions dans les composants

---

## 🤝 Support & Contribution

### Besoin d'aide?

1. **Consultez** `AIRTABLE_SETUP_GUIDE.md`
2. **Ouvrez la console** (F12) pour voir les erreurs
3. **Vérifiez** les logs du serveur

### Contribuer

1. Fork le projet
2. Créez une branche (`git checkout -b feature/ma-fonctionnalite`)
3. Committez (`git commit -m 'Ajout: ma fonctionnalité'`)
4. Push (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

---

## 📄 Licence

MIT License - Utilisez librement pour vos projets!

---

## 🎉 Prochaines Étapes

Après l'installation:

1. ✅ **Testez** l'authentification (Admin & Directeur)
2. ✅ **Configurez** Airtable avec vos 78 projets
3. ✅ **Personnalisez** les identifiants de connexion
4. ✅ **Ajoutez** vos propres projets
5. ✅ **Déployez** sur Vercel ou Netlify

**Bon travail! 🚀**
