# 🚀 Setup Instructions - Configuration Complète

## Configuration pour votre Installation

Ce guide vous explique comment configurer l'application avec vos identifiants réels et votre base Airtable.

---

## 📋 Étape 1: Créer le fichier .env.local

1. À la racine du projet, créez un fichier nommé `.env.local`
2. Copiez le contenu ci-dessous et remplissez avec vos informations

```bash
# ============================================
# AIRTABLE CONFIGURATION
# ============================================
VITE_AIRTABLE_API_KEY=your_airtable_api_key_here
VITE_AIRTABLE_BASE_ID=your_airtable_base_id_here
VITE_AIRTABLE_TABLE_NAME=Projects

# ============================================
# AUTHENTICATION - ADMIN ACCOUNT
# ============================================
VITE_ADMIN_EMAIL=Rahima.kone@cgi.ci
VITE_ADMIN_PASSWORD=Rqpx03!21DPGS
VITE_ADMIN_NAME=Rahima Kone

# ============================================
# AUTHENTICATION - DIRECTEUR ACCOUNTS
# ============================================
VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com,marie.ayoman@quipux.com
VITE_DIRECTEUR_PASSWORDS=MotDePasse1,MotDePasse2
VITE_DIRECTEUR_NAMES=Ibrahima Kone,Marie Ayoman
```

---

## 🔐 Étape 2: Configuration de l'Authentification

### Admin (Accès Complet)

**Déjà configuré:**
- **Email:** Rahima.kone@cgi.ci
- **Mot de passe:** Rqpx03!21DPGS
- **Nom:** Rahima Kone
- **Permissions:** Créer, modifier, supprimer tous les projets

### Directeurs (Lecture seule)

**À configurer - Définissez les mots de passe:**

Remplacez `MotDePasse1` et `MotDePasse2` dans `.env.local` par les vrais mots de passe:

```bash
# Exemple:
VITE_DIRECTEUR_PASSWORDS=SecurePass123!,AnotherPass456!
```

**Comptes Directeur:**
1. **Ibrahima Kone** - ibrahima.kone@quipux.com
2. **Marie Ayoman** - marie.ayoman@quipux.com

### Ajouter d'Autres Directeurs

Pour ajouter plus de directeurs, ajoutez-les à la fin des listes (séparés par des virgules):

```bash
# Avant:
VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com,marie.ayoman@quipux.com
VITE_DIRECTEUR_PASSWORDS=Pass1,Pass2
VITE_DIRECTEUR_NAMES=Ibrahima Kone,Marie Ayoman

# Après (avec un 3e directeur):
VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com,marie.ayoman@quipux.com,nouveau.directeur@quipux.com
VITE_DIRECTEUR_PASSWORDS=Pass1,Pass2,Pass3
VITE_DIRECTEUR_NAMES=Ibrahima Kone,Marie Ayoman,Nouveau Directeur
```

**⚠️ Important:** 
- Le nombre d'emails, de mots de passe et de noms doit être identique
- Utilisez des virgules pour séparer les valeurs
- Pas d'espaces autour des virgules

---

## 📊 Étape 3: Configuration Airtable

### 3.1: Obtenir votre API Key

1. Allez sur: **https://airtable.com/create/tokens**
2. Cliquez sur **"Create new token"**
3. Nom du token: `"French PM Dashboard"`
4. Permissions requises:
   - ✅ `data.records:read`
   - ✅ `data.records:write`
   - ✅ `schema.bases:read`
5. Sélectionnez votre Base dans "Access"
6. Créez le token
7. **Copiez immédiatement** (il commence par `pat...`)
8. Collez-le dans `.env.local` → `VITE_AIRTABLE_API_KEY`

### 3.2: Obtenir votre Base ID

1. Ouvrez votre base Airtable dans le navigateur
2. L'URL ressemble à:
   ```
   https://airtable.com/appXXXXXXXXXXXXXX/tblYYYYYYYYYYYYYY
   ```
3. Copiez la partie `appXXXXXXXXXXXXXX` (après `airtable.com/`)
4. Collez-la dans `.env.local` → `VITE_AIRTABLE_BASE_ID`

### 3.3: Nom de la Table

Si votre table s'appelle `"Projects"`, c'est bon!

Si elle a un autre nom, modifiez dans `.env.local`:
```bash
VITE_AIRTABLE_TABLE_NAME=VotreNomDeTable
```

---

## 🗂️ Étape 4: Structure de la Table Airtable

Votre table Airtable utilise déjà les noms de colonnes en français. L'application fait automatiquement la correspondance!

### Colonnes Airtable (Français) ✅

Assurez-vous que votre table a exactement ces colonnes:

| Nom de Colonne Airtable | Type | Options |
|-------------------------|------|---------|
| **Projets** | Single line text | Nom du projet |
| **Direction** | Single select | DSI, DAF, RH, DGP, DDEV |
| **Statut** | Single select | 9 options (voir ci-dessous) |
| **Priorité** | Single select | Haute, Moyenne, Basse |
| **Etat d'avancement** | Number | 0-100 |
| **Chef de Projet** | Single line text | Nom du chef |
| **Partenaires au Projet** | Long text | Partenaires |
| **Debut de Projet** | Date | Date de début |
| **Fin Prevue du Projet** | Date | Date de fin |
| **Commentaire** | Long text | Commentaires |
| **Indicateur de Retard** | Checkbox | Oui/Non |

### Options pour "Statut" (9 valeurs exactes)

```
1. Non démarré
2. En étude
3. En exécution
4. En attente de Go pour production
5. En production
6. En service
7. En pause
8. Clôturé
9. Abandonné
```

### Options pour "Direction" (5 valeurs)

```
1. DSI
2. DAF
3. RH
4. DGP
5. DDEV
```

### Options pour "Priorité" (3 valeurs)

```
1. Haute
2. Moyenne
3. Basse
```

---

## ✅ Étape 5: Vérification

### Fichier .env.local Complet

Votre fichier `.env.local` devrait ressembler à ceci:

```bash
# AIRTABLE
VITE_AIRTABLE_API_KEY=patAbCdEfGhIjKlMnOpQr123456789...
VITE_AIRTABLE_BASE_ID=appXYZ123ABC456
VITE_AIRTABLE_TABLE_NAME=Projects

# ADMIN
VITE_ADMIN_EMAIL=Rahima.kone@cgi.ci
VITE_ADMIN_PASSWORD=Rqpx03!21DPGS
VITE_ADMIN_NAME=Rahima Kone

# DIRECTEURS
VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com,marie.ayoman@quipux.com
VITE_DIRECTEUR_PASSWORDS=VotreMotDePasse1,VotreMotDePasse2
VITE_DIRECTEUR_NAMES=Ibrahima Kone,Marie Ayoman
```

**Checklist:**
- [ ] Toutes les variables commencent par `VITE_`
- [ ] L'API Key commence par `pat`
- [ ] Le Base ID commence par `app`
- [ ] Tous les mots de passe sont définis
- [ ] Le nombre d'emails = nombre de passwords = nombre de noms
- [ ] Pas de guillemets autour des valeurs
- [ ] Pas d'espaces inutiles

---

## 🚀 Étape 6: Démarrer l'Application

```bash
# Installez les dépendances (première fois)
npm install

# Démarrez le serveur de développement
npm run dev
```

Ouvrez: **http://localhost:5173/login**

---

## 🔐 Étape 7: Test de Connexion

### Test 1: Admin

1. Allez sur http://localhost:5173/login
2. **Email:** Rahima.kone@cgi.ci
3. **Mot de passe:** Rqpx03!21DPGS
4. Cliquez "Se connecter"
5. ✅ Vous devriez voir le Dashboard
6. ✅ Badge "Administrateur" en haut à droite
7. ✅ Bouton "Ajouter un Nouveau Projet" visible

### Test 2: Directeur

1. Déconnectez-vous (bouton en haut à droite)
2. **Email:** ibrahima.kone@quipux.com
3. **Mot de passe:** [le mot de passe que vous avez défini]
4. Cliquez "Se connecter"
5. ✅ Vous devriez voir le Dashboard
6. ✅ Badge "Directeur" en haut à droite
7. ✅ Bannière bleue "Mode lecture seule"
8. ❌ Pas de bouton "Ajouter un Nouveau Projet"

### Test 3: Airtable

1. Connecté en Admin, allez sur le Dashboard
2. Vérifiez en haut:
   - ✅ **Pas de bannière jaune** = Airtable connecté
   - ❌ **Bannière jaune** = Problème de configuration
3. Le nombre de projets doit correspondre à votre Airtable (78)
4. Créez un nouveau projet:
   - Cliquez "Ajouter un Nouveau Projet"
   - Remplissez le formulaire
   - Cliquez "Enregistrer"
   - ✅ Vérifiez qu'il apparaît dans Airtable

---

## 🐛 Dépannage

### Erreur: "No users configured"

**Cause:** Variables d'authentification mal configurées

**Solution:**
1. Ouvrez `.env.local`
2. Vérifiez que toutes les variables sont présentes:
   - `VITE_ADMIN_EMAIL`
   - `VITE_ADMIN_PASSWORD`
   - `VITE_DIRECTEUR_EMAILS`
   - `VITE_DIRECTEUR_PASSWORDS`
3. Redémarrez: `npm run dev`

### Erreur: "Email ou mot de passe incorrect"

**Causes possibles:**
- ❌ Faute de frappe dans l'email ou le mot de passe
- ❌ Variables pas définies dans `.env.local`
- ❌ Serveur pas redémarré après modification `.env.local`

**Solution:**
1. Vérifiez l'email dans `.env.local` (respectez la casse)
2. Vérifiez le mot de passe (caractères spéciaux inclus)
3. Redémarrez le serveur: Ctrl+C puis `npm run dev`
4. Ouvrez la console (F12) pour voir les logs

### Erreur: "Airtable non configuré"

**Cause:** Bannière jaune affichée = variables Airtable manquantes

**Solution:**
1. Vérifiez `.env.local` contient:
   - `VITE_AIRTABLE_API_KEY`
   - `VITE_AIRTABLE_BASE_ID`
2. Vérifiez que les valeurs sont correctes
3. Redémarrez: `npm run dev`

### Erreur: "Mismatch between number of emails and passwords"

**Cause:** Nombre différent d'emails et de mots de passe

**Solution:**
```bash
# Mauvais:
VITE_DIRECTEUR_EMAILS=email1@test.com,email2@test.com
VITE_DIRECTEUR_PASSWORDS=pass1
# ❌ 2 emails, 1 password

# Bon:
VITE_DIRECTEUR_EMAILS=email1@test.com,email2@test.com
VITE_DIRECTEUR_PASSWORDS=pass1,pass2
# ✅ 2 emails, 2 passwords
```

### Colonnes Airtable non trouvées

**Erreur dans la console:** "Cannot read property 'Projets'"

**Solution:**
1. Vérifiez les noms de colonnes **exacts** dans Airtable
2. Ils doivent correspondre exactement à:
   - `Projets` (pas `Projet` ou `PROJETS`)
   - `Direction` (pas `Directions`)
   - `Statut` (pas `Status`)
   - etc.
3. Respectez les accents et la casse!

---

## 🔒 Sécurité

### ⚠️ Important

**Ce système est simplifié pour la démonstration:**
- Les mots de passe sont en clair dans `.env.local`
- Pas de hashage
- Sessions localStorage seulement
- Pas d'expiration de session

**Pour un environnement de production:**
1. Utilisez **Supabase Authentication**
2. Ou implémentez:
   - Hashage bcrypt des mots de passe
   - JWT tokens
   - Sessions côté serveur
   - HTTPS obligatoire

### Bonnes Pratiques

✅ **À FAIRE:**
- Gardez `.env.local` secret
- Utilisez des mots de passe forts
- Ne commitez jamais `.env.local` sur Git
- Changez les mots de passe régulièrement

❌ **À NE PAS FAIRE:**
- Partager le fichier `.env.local`
- Utiliser des mots de passe faibles
- Committer les credentials sur Git
- Utiliser les mêmes mots de passe partout

---

## 📞 Support

### Console de Logs

Ouvrez la console (F12) au démarrage. Vous devriez voir:

```
✅ 3 user(s) configured:
   - Rahima.kone@cgi.ci (admin)
   - ibrahima.kone@quipux.com (directeur)
   - marie.ayoman@quipux.com (directeur)
```

Si vous voyez `❌ No users configured!`, vérifiez votre `.env.local`

### Vérifier les Variables

Ajoutez temporairement dans `/services/auth.ts`:

```typescript
console.log('Admin email:', import.meta.env.VITE_ADMIN_EMAIL);
console.log('Directeur emails:', import.meta.env.VITE_DIRECTEUR_EMAILS);
```

---

## 🎉 Configuration Complète!

Une fois tout configuré:

1. ✅ **3 comptes fonctionnels** (1 admin, 2 directeurs)
2. ✅ **Airtable connecté** (78 projets)
3. ✅ **Application prête** à l'emploi

**Prochaine étape:** Déploiement sur Vercel/Netlify

---

**Besoin d'aide?** Consultez:
- `AIRTABLE_SETUP_GUIDE.md` - Guide Airtable détaillé
- `QUICK_START.md` - Guide rapide
- `README.md` - Documentation principale
