# 🔑 Credentials Reference Card

**⚠️ CONFIDENTIEL - Ne pas partager ce fichier!**

---

## 📋 Configuration Actuelle

### Admin Account (Full CRUD Access)

```
Email:    Rahima.kone@cgi.ci
Password: Rqpx03!21DPGS
Name:     Rahima Kone
Role:     Administrateur

Permissions:
✅ Créer des projets
✅ Modifier des projets
✅ Supprimer des projets
✅ Voir toutes les statistiques
```

---

### Directeur Accounts (Read-Only Access)

#### Directeur 1

```
Email:    ibrahima.kone@quipux.com
Password: [À DÉFINIR]
Name:     Ibrahima Kone
Role:     Directeur

Permissions:
✅ Voir tous les projets
✅ Voir toutes les statistiques
❌ Pas de création
❌ Pas de modification
❌ Pas de suppression
```

#### Directeur 2

```
Email:    marie.ayoman@quipux.com
Password: [À DÉFINIR]
Name:     Marie Ayoman
Role:     Directeur

Permissions:
✅ Voir tous les projets
✅ Voir toutes les statistiques
❌ Pas de création
❌ Pas de modification
❌ Pas de suppression
```

---

## 📝 Actions Requises

### 1. Définir les Mots de Passe Directeurs

Dans `.env.local`, remplacez:

```bash
# REMPLACER CECI:
VITE_DIRECTEUR_PASSWORDS=MotDePasse1,MotDePasse2

# PAR VOS VRAIS MOTS DE PASSE:
VITE_DIRECTEUR_PASSWORDS=VotreMotDePasseSecurise1,VotreMotDePasseSecurise2
```

### 2. Communiquer les Identifiants

**À Ibrahima Kone:**
- Email: ibrahima.kone@quipux.com
- Mot de passe: [le mot de passe que vous avez défini]
- URL: https://votre-app.vercel.app/login

**À Marie Ayoman:**
- Email: marie.ayoman@quipux.com
- Mot de passe: [le mot de passe que vous avez défini]
- URL: https://votre-app.vercel.app/login

---

## ➕ Ajouter de Nouveaux Directeurs

Si vous devez ajouter d'autres directeurs plus tard:

### Étape 1: Modifier .env.local

```bash
# AVANT (2 directeurs):
VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com,marie.ayoman@quipux.com
VITE_DIRECTEUR_PASSWORDS=Pass1,Pass2
VITE_DIRECTEUR_NAMES=Ibrahima Kone,Marie Ayoman

# APRÈS (3 directeurs):
VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com,marie.ayoman@quipux.com,nouveau.directeur@email.com
VITE_DIRECTEUR_PASSWORDS=Pass1,Pass2,Pass3
VITE_DIRECTEUR_NAMES=Ibrahima Kone,Marie Ayoman,Nouveau Directeur
```

### Étape 2: Redémarrer

```bash
# Développement:
npm run dev

# Production (Vercel):
Redéployer l'application avec les nouvelles variables d'environnement
```

---

## 🔒 Sécurité

### Recommandations de Mots de Passe

**Bon mot de passe:**
- ✅ Au moins 12 caractères
- ✅ Majuscules et minuscules
- ✅ Chiffres
- ✅ Caractères spéciaux (!@#$%^&*)
- ✅ Unique (pas utilisé ailleurs)

**Exemple:** `SecureP@ss2026!`

**Mauvais mot de passe:**
- ❌ Court (< 8 caractères)
- ❌ Mot du dictionnaire
- ❌ Dates ou noms
- ❌ 123456 ou password

---

## 📊 Airtable Configuration

### Connexion Airtable

```
API Key:   [VOTRE TOKEN AIRTABLE]
Base ID:   [VOTRE BASE ID]
Table:     Projects
```

### Colonnes Airtable (Français)

✅ Les colonnes sont automatiquement mappées:

```
Projets                  → name
Direction                → department
Statut                   → status
Priorité                 → priority
Etat d'avancement        → progress
Chef de Projet           → projectManager
Partenaires au Projet    → partners
Debut de Projet          → startDate
Fin Prevue du Projet     → endDate
Commentaire              → comments
Indicateur de Retard     → isDelayed
```

Pas besoin de renommer vos colonnes!

---

## 🚀 URLs de l'Application

### Développement

```
Login:     http://localhost:5173/login
Dashboard: http://localhost:5173/
Kanban:    http://localhost:5173/projets
Timeline:  http://localhost:5173/chronologie
```

### Production (À définir après déploiement)

```
Login:     https://[votre-app].vercel.app/login
Dashboard: https://[votre-app].vercel.app/
Kanban:    https://[votre-app].vercel.app/projets
Timeline:  https://[votre-app].vercel.app/chronologie
```

---

## 📞 Support Technique

### En cas de problème

1. **Vérifiez la console** (F12 dans le navigateur)
2. **Consultez les logs** du serveur
3. **Référez-vous à:** `SETUP_INSTRUCTIONS.md`

### Logs Attendus au Démarrage

```
✅ 3 user(s) configured:
   - Rahima.kone@cgi.ci (admin)
   - ibrahima.kone@quipux.com (directeur)
   - marie.ayoman@quipux.com (directeur)
```

Si vous voyez:
```
❌ No users configured!
```
→ Problème dans `.env.local`, vérifiez les variables

---

## 📋 Checklist de Déploiement

### Avant le Déploiement

- [ ] `.env.local` configuré localement
- [ ] Tous les mots de passe définis
- [ ] Connexion Airtable testée (pas de bannière jaune)
- [ ] Les 3 comptes testés (admin + 2 directeurs)
- [ ] CRUD testé (créer/modifier/supprimer projet)
- [ ] Mode directeur testé (lecture seule)

### Lors du Déploiement (Vercel)

- [ ] Variables d'environnement ajoutées sur Vercel:
  - [ ] `VITE_AIRTABLE_API_KEY`
  - [ ] `VITE_AIRTABLE_BASE_ID`
  - [ ] `VITE_AIRTABLE_TABLE_NAME`
  - [ ] `VITE_ADMIN_EMAIL`
  - [ ] `VITE_ADMIN_PASSWORD`
  - [ ] `VITE_ADMIN_NAME`
  - [ ] `VITE_DIRECTEUR_EMAILS`
  - [ ] `VITE_DIRECTEUR_PASSWORDS`
  - [ ] `VITE_DIRECTEUR_NAMES`
- [ ] Application déployée
- [ ] Test de connexion admin en production
- [ ] Test de connexion directeur en production
- [ ] Vérification chargement des 78 projets

### Après le Déploiement

- [ ] URL communiquée aux utilisateurs
- [ ] Identifiants communiqués individuellement
- [ ] Documentation partagée si nécessaire
- [ ] Support disponible pour les questions

---

## 🔐 Gestion des Accès

### Qui a accès à quoi?

| Utilisateur | Email | Rôle | Créer | Modifier | Supprimer | Voir |
|-------------|-------|------|-------|----------|-----------|------|
| Rahima Kone | rahima.kone@cgi.ci | Admin | ✅ | ✅ | ✅ | ✅ |
| Ibrahima Kone | ibrahima.kone@quipux.com | Directeur | ❌ | ❌ | ❌ | ✅ |
| Marie Ayoman | marie.ayoman@quipux.com | Directeur | ❌ | ❌ | ❌ | ✅ |

### Révoquer un Accès

Pour retirer l'accès d'un directeur:

1. Ouvrez `.env.local`
2. Retirez son email, mot de passe et nom des listes
3. Redémarrez / Redéployez

**Exemple - Retirer Marie Ayoman:**

```bash
# AVANT:
VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com,marie.ayoman@quipux.com
VITE_DIRECTEUR_PASSWORDS=Pass1,Pass2
VITE_DIRECTEUR_NAMES=Ibrahima Kone,Marie Ayoman

# APRÈS:
VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com
VITE_DIRECTEUR_PASSWORDS=Pass1
VITE_DIRECTEUR_NAMES=Ibrahima Kone
```

---

## 📝 Notes Importantes

### ⚠️ Sécurité

1. **Ce fichier est CONFIDENTIEL**
   - Ne le commitez jamais sur Git
   - Ne le partagez jamais publiquement
   - Gardez-le dans un endroit sécurisé

2. **Les mots de passe en clair**
   - Pour la production, considérez Supabase Authentication
   - Ou implémentez un hashage bcrypt
   - Ce système est simplifié pour le développement

3. **Changement de mot de passe**
   - Modifiez dans `.env.local`
   - Redémarrez l'application
   - Communiquez le nouveau mot de passe

### 🔄 Maintenance

**Changer un mot de passe:**
1. Modifier `.env.local`
2. Redémarrer/Redéployer
3. Informer l'utilisateur

**Ajouter un utilisateur:**
1. Ajouter à la liste dans `.env.local`
2. Redémarrer/Redéployer
3. Communiquer les identifiants

**Promouvoir un Directeur en Admin:**
- ❌ Pas possible avec le système actuel
- ✅ Solution: Créer un nouveau compte admin

---

**Dernière mise à jour:** Mars 2026  
**Configuration pour:** Rahima Kone (Admin) + 2 Directeurs
