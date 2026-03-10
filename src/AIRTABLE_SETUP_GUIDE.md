# Guide de Configuration Airtable

## 📋 Table des Matières

1. [Configuration Airtable](#1-configuration-airtable)
2. [Obtenir vos Identifiants](#2-obtenir-vos-identifiants)
3. [Configuration de l'Application](#3-configuration-de-lapplication)
4. [Authentification](#4-authentification)
5. [Test de la Connexion](#5-test-de-la-connexion)
6. [Dépannage](#6-dépannage)

---

## 1. Configuration Airtable

### Étape 1.1: Structure de la Table "Projects"

Votre table Airtable doit avoir exactement ces champs:

| Nom du Champ | Type | Options/Notes |
|--------------|------|---------------|
| `name` | Single line text | Nom du projet |
| `department` | Single select | Options: DSI, DAF, RH, DGP, DDEV |
| `status` | Single select | 9 options (voir ci-dessous) |
| `priority` | Single select | Options: Haute, Moyenne, Basse |
| `progress` | Number | Format: Integer, Min: 0, Max: 100 |
| `projectManager` | Single line text | Nom du chef de projet |
| `partners` | Long text | Noms des partenaires |
| `startDate` | Date | Format: ISO (YYYY-MM-DD) |
| `endDate` | Date | Format: ISO (YYYY-MM-DD) |
| `comments` | Long text | Commentaires et notes |
| `isDelayed` | Checkbox | Oui/Non |

### Options du Champ "status" (9 valeurs)

Ajoutez ces options exactement comme indiqué:

1. `Non démarré`
2. `En étude`
3. `En exécution`
4. `En attente de Go pour production`
5. `En production`
6. `En service`
7. `En pause`
8. `Clôturé`
9. `Abandonné`

### Options du Champ "department" (5 valeurs)

1. `DSI`
2. `DAF`
3. `RH`
4. `DGP`
5. `DDEV`

### Options du Champ "priority" (3 valeurs)

1. `Haute`
2. `Moyenne`
3. `Basse`

---

## 2. Obtenir vos Identifiants

### Étape 2.1: Obtenir votre API Key

1. Allez sur: **https://airtable.com/create/tokens**
2. Cliquez sur **"Create new token"**
3. Donnez un nom au token: `"French PM Dashboard"`
4. Sélectionnez les scopes nécessaires:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
   - ✅ `schema.bases:read`
5. Sous "Access", sélectionnez votre Base
6. Cliquez sur **"Create token"**
7. **Copiez le token** (il commence par `pat...`)
8. ⚠️ **Sauvegardez-le immédiatement** - vous ne pourrez pas le revoir!

### Étape 2.2: Obtenir votre Base ID

1. Ouvrez votre base Airtable dans le navigateur
2. Regardez l'URL, elle ressemble à:
   ```
   https://airtable.com/appXXXXXXXXXXXXXX/tblYYYYYYYYYYYYYY/viwZZZZZZZZZZZZZZ
   ```
3. Copiez la partie `appXXXXXXXXXXXXXX` (commence par `app`)
4. C'est votre **Base ID**

### Étape 2.3: Nom de la Table

- Si votre table s'appelle `"Projects"`, vous n'avez rien à faire
- Si elle s'appelle autrement, notez le nom exact (respectez la casse)

---

## 3. Configuration de l'Application

### Étape 3.1: Créer le fichier .env.local

1. À la racine du projet, créez un fichier nommé: **`.env.local`**
2. Ajoutez ces lignes:

```bash
# AIRTABLE CONFIGURATION
VITE_AIRTABLE_API_KEY=your_api_key_here
VITE_AIRTABLE_BASE_ID=your_base_id_here
VITE_AIRTABLE_TABLE_NAME=Projects

# AUTHENTICATION (optionnel - modifier les identifiants par défaut)
VITE_ADMIN_EMAIL=admin@entreprise.fr
VITE_ADMIN_PASSWORD=admin123
VITE_DIRECTEUR_EMAIL=directeur@entreprise.fr
VITE_DIRECTEUR_PASSWORD=directeur123
```

### Étape 3.2: Remplacer les Valeurs

Remplacez:
- `your_api_key_here` → Votre token API (commence par `pat...`)
- `your_base_id_here` → Votre Base ID (commence par `app`)
- `Projects` → Le nom de votre table (si différent)

**Exemple de fichier .env.local complété:**

```bash
# AIRTABLE CONFIGURATION
VITE_AIRTABLE_API_KEY=patAbCdEfGhIjKlMnOpQrStUvWxYz123456.abcdefghijklmnop
VITE_AIRTABLE_BASE_ID=appABCD1234EFGH56
VITE_AIRTABLE_TABLE_NAME=Projects

# AUTHENTICATION
VITE_ADMIN_EMAIL=admin@monentreprise.fr
VITE_ADMIN_PASSWORD=MonMotDePasse123!
VITE_DIRECTEUR_EMAIL=directeur@monentreprise.fr
VITE_DIRECTEUR_PASSWORD=AutreMotDePasse456!
```

### Étape 3.3: Sécurité

⚠️ **IMPORTANT:**

- **Ne partagez JAMAIS votre `.env.local`**
- Le fichier `.env.local` est déjà dans `.gitignore`
- Ne commitez JAMAIS vos clés API sur Git
- Pour la production, utilisez les variables d'environnement de votre hébergeur

---

## 4. Authentification

### Comptes par Défaut

Si vous ne modifiez pas les variables d'environnement, ces comptes sont disponibles:

#### Administrateur (Full CRUD)
- **Email:** `admin@entreprise.fr`
- **Mot de passe:** `admin123`
- **Permissions:** Créer, lire, modifier, supprimer

#### Directeur (Lecture seule)
- **Email:** `directeur@entreprise.fr`
- **Mot de passe:** `directeur123`
- **Permissions:** Lecture seule (aucune modification)

### Personnaliser les Identifiants

Pour changer les identifiants de connexion, modifiez dans `.env.local`:

```bash
VITE_ADMIN_EMAIL=votreemail@domaine.com
VITE_ADMIN_PASSWORD=VotreMotDePasse
VITE_DIRECTEUR_EMAIL=directeur@domaine.com
VITE_DIRECTEUR_PASSWORD=AutreMotDePasse
```

### ⚠️ Note sur la Sécurité

**Cette authentification est SIMPLIFIÉE pour la démonstration.**

Pour une application de production:

1. **Option recommandée:** Utilisez Supabase Authentication
   - Configuration sécurisée
   - Gestion des utilisateurs
   - Tokens JWT
   - Réinitialisation de mot de passe
   - Authentification multi-facteurs

2. **Option alternative:** Créez une table "Users" dans Airtable
   - Stockez les utilisateurs avec mots de passe hashés (bcrypt)
   - Implémentez une vraie gestion de session
   - Ajoutez la validation par email

---

## 5. Test de la Connexion

### Étape 5.1: Démarrer l'Application

```bash
npm run dev
```

### Étape 5.2: Se Connecter

1. Ouvrez `http://localhost:5173/login`
2. Connectez-vous avec les identifiants admin
3. Vous devriez voir le tableau de bord

### Étape 5.3: Vérifier la Connexion Airtable

**Si Airtable est configuré correctement:**
- ✅ Vous verrez vos 78 projets réels
- ✅ Le nombre de projets s'affiche correctement dans les KPI
- ✅ Pas de bannière jaune "Mode démonstration"

**Si Airtable n'est PAS configuré:**
- ⚠️ Bannière jaune: "Mode démonstration"
- ℹ️ Utilisation des 12 projets de test
- ℹ️ Les modifications ne seront pas sauvegardées

### Étape 5.4: Tester les Opérations CRUD (Admin)

1. **Créer:** Cliquez sur "Nouveau Projet" → Remplissez le formulaire → Enregistrer
2. **Lire:** Les projets s'affichent sur toutes les pages
3. **Modifier:** Cliquez sur un projet → Modifiez les champs → Enregistrer
4. **Supprimer:** Ouvrez un projet → Cliquez sur "Supprimer"

### Étape 5.5: Tester le Mode Directeur

1. Déconnectez-vous (bouton "Déconnexion")
2. Connectez-vous avec le compte Directeur
3. Vérifiez que:
   - ✅ Les projets s'affichent
   - ✅ Pas de bouton "Nouveau Projet"
   - ✅ Les formulaires sont désactivés
   - ✅ Bannière bleue "Mode lecture seule"

---

## 6. Dépannage

### Problème: "Airtable n'est pas configuré"

**Causes possibles:**
- ❌ Fichier `.env.local` n'existe pas
- ❌ Variables mal nommées (vérifiez `VITE_` au début)
- ❌ Fichier `.env.local` mal placé (doit être à la racine)

**Solution:**
1. Vérifiez que `.env.local` existe à la racine
2. Redémarrez le serveur de développement (`npm run dev`)

### Problème: "Erreur 401 - Unauthorized"

**Causes possibles:**
- ❌ API Key invalide ou expirée
- ❌ Token API mal copié

**Solution:**
1. Regénérez un nouveau token sur Airtable
2. Copiez-le sans espaces au début/fin
3. Redémarrez l'application

### Problème: "Erreur 404 - Not Found"

**Causes possibles:**
- ❌ Base ID incorrect
- ❌ Nom de table incorrect
- ❌ Table supprimée ou renommée

**Solution:**
1. Vérifiez le Base ID dans l'URL Airtable
2. Vérifiez le nom exact de la table (sensible à la casse)
3. Vérifiez que la table existe dans la base

### Problème: "Erreur 403 - Forbidden"

**Causes possibles:**
- ❌ Token API n'a pas les bonnes permissions
- ❌ Base non sélectionnée dans les permissions du token

**Solution:**
1. Recréez un token avec les bons scopes
2. Sélectionnez la base dans "Access"
3. Assurez-vous d'avoir `data.records:read` et `data.records:write`

### Problème: Champs manquants ou erreurs de données

**Causes possibles:**
- ❌ Noms de champs différents dans Airtable
- ❌ Types de champs incorrects
- ❌ Options manquantes dans les Single Select

**Solution:**
1. Vérifiez que tous les champs existent
2. Vérifiez les noms exacts (sensible à la casse)
3. Ajoutez toutes les options des champs Select
4. Ouvrez la console (F12) pour voir les erreurs détaillées

### Vérifier la Console du Navigateur

Ouvrez la console (F12) et cherchez:
- ✅ `✅ 78 projets chargés depuis Airtable` → Connexion réussie
- ⚠️ `⚠️ Airtable non configuré` → Vérifiez `.env.local`
- ❌ Erreurs réseau → Vérifiez API Key et Base ID

---

## 📞 Support

### Logs Utiles

Pour déboguer, ouvrez la console (F12) et cherchez:

```
✅ 78 projets chargés depuis Airtable
```

### Vérifier les Variables d'Environnement

Ajoutez temporairement dans `/services/airtable.ts`:

```typescript
console.log('API Key configured:', !!AIRTABLE_API_KEY);
console.log('Base ID configured:', !!AIRTABLE_BASE_ID);
console.log('Table name:', AIRTABLE_TABLE_NAME);
```

---

## 🚀 Prochaines Étapes

Une fois connecté à Airtable:

1. ✅ Testez toutes les opérations CRUD
2. ✅ Vérifiez les permissions Admin/Directeur
3. ✅ Importez vos 78 projets (s'ils ne sont pas déjà là)
4. ✅ Personnalisez les identifiants de connexion
5. ✅ Déployez sur Vercel/Netlify avec les variables d'environnement

---

## 🔐 Déploiement en Production

### Sur Vercel

1. Connectez votre repo GitHub
2. Dans "Environment Variables", ajoutez:
   - `VITE_AIRTABLE_API_KEY`
   - `VITE_AIRTABLE_BASE_ID`
   - `VITE_AIRTABLE_TABLE_NAME`
   - Identifiants d'authentification
3. Déployez

### Sur Netlify

1. Connectez votre repo GitHub
2. Dans "Site settings" → "Environment variables"
3. Ajoutez les mêmes variables
4. Redéployez

**⚠️ IMPORTANT:** Ne stockez JAMAIS les clés API dans le code source!
