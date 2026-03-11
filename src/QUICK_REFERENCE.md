# ⚡ Quick Reference Card

**French Project Management Dashboard - Configuration rapide**

---

## 🚀 Start in 3 Steps

### 1. Create `.env.local`

```bash
# Copy from template
cp .env.local.example .env.local

# Edit with your values
nano .env.local  # or use your editor
```

### 2. Fill in Your Credentials

```bash
# AIRTABLE
VITE_AIRTABLE_API_KEY=pat_xxxxx
VITE_AIRTABLE_BASE_ID=app_xxxxx
VITE_AIRTABLE_TABLE_NAME=Projects

# ADMIN
VITE_ADMIN_EMAIL=Rahima.kone@cgi.ci
VITE_ADMIN_PASSWORD=Rqpx03!21DPGS
VITE_ADMIN_NAME=Rahima Kone

# DIRECTEURS
VITE_DIRECTEUR_EMAILS=ibrahima.kone@quipux.com,marie.ayoman@quipux.com
VITE_DIRECTEUR_PASSWORDS=YourPass1,YourPass2
VITE_DIRECTEUR_NAMES=Ibrahima Kone,Marie Ayoman
```

### 3. Run

```bash
npm install && npm run dev
```

Open: **http://localhost:5173/login**

---

## 🔑 Login Credentials

### Admin
```
Email:    Rahima.kone@cgi.ci
Password: Rqpx03!21DPGS
```

### Directeur 1
```
Email:    ibrahima.kone@quipux.com
Password: [YOUR PASSWORD]
```

### Directeur 2
```
Email:    marie.ayoman@quipux.com
Password: [YOUR PASSWORD]
```

---

## 📊 Airtable French Columns

✅ **Your columns work as-is!**

```
Projets                → name
Direction              → department
Statut                 → status
Priorité               → priority
Etat d'avancement      → progress
Chef de Projet         → projectManager
Partenaires au Projet  → partners
Debut de Projet        → startDate
Fin Prevue du Projet   → endDate
Commentaire            → comments
Indicateur de Retard   → isDelayed
```

No changes needed to your Airtable table!

---

## ➕ Add More Directeurs

Add to lists (comma-separated, no spaces):

```bash
VITE_DIRECTEUR_EMAILS=email1,email2,email3
VITE_DIRECTEUR_PASSWORDS=pass1,pass2,pass3
VITE_DIRECTEUR_NAMES=Name1,Name2,Name3
```

**Must have same number of emails, passwords, and names!**

---

## 🔍 Verify Setup

### Console Should Show:
```
✅ 3 user(s) configured:
   - Rahima.kone@cgi.ci (admin)
   - ibrahima.kone@quipux.com (directeur)
   - marie.ayoman@quipux.com (directeur)
```

### After Login:
- ✅ No yellow banner = Airtable connected
- ❌ Yellow banner = Check `.env.local`

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "No users configured" | Check `.env.local` variables |
| "Email ou mot de passe incorrect" | Verify email/password in `.env.local` |
| "Airtable non configuré" | Add VITE_AIRTABLE_* variables |
| Yellow banner | Check Airtable API key & Base ID |
| Column errors | Verify French column names in Airtable |

**Fix & restart:** `npm run dev`

---

## 📖 Full Documentation

- **SETUP_INSTRUCTIONS.md** - Complete setup guide
- **CREDENTIALS_REFERENCE.md** - User management
- **IMPLEMENTATION_SUMMARY.md** - What was changed
- **README.md** - Main documentation

---

## 🚢 Deploy to Vercel

```bash
# 1. Push to GitHub
git push origin main

# 2. On Vercel:
#    - Import repo
#    - Add all VITE_* variables
#    - Deploy

# 3. Done!
https://your-app.vercel.app
```

---

## 📞 Support

**Startup logs location:** Browser console (F12)

**Key files to check:**
- `.env.local` - Configuration
- `/services/auth.ts` - Authentication
- `/services/airtable.ts` - Database

**Need help?** See `SETUP_INSTRUCTIONS.md`

---

**Configuration:** 1 Admin + 2 Directeurs  
**Airtable:** French columns supported  
**Status:** ✅ Ready to use
