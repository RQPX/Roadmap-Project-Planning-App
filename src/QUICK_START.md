# ⚡ Quick Start Guide - 5 Minutes

## 🎯 Start Using the App NOW

### Option 1: Demo Mode (0 minutes)

**Just want to see it work?**

```bash
npm install
npm run dev
```

Open: **http://localhost:5173/login**

**Login:**
- Email: `admin@entreprise.fr`
- Password: `admin123`

✅ **Done!** You're using 12 test projects. All features work (changes won't be saved).

---

### Option 2: Connect Your 78 Real Projects (5 minutes)

#### Step 1: Get Airtable Credentials (2 min)

1. **API Key:** https://airtable.com/create/tokens
   - Create token with `data.records:read` + `data.records:write`
   - Copy the token (starts with `pat...`)

2. **Base ID:** Open your Airtable base
   - Look at URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - Copy `appXXXXXXXXXXXXXX` part

#### Step 2: Create `.env.local` File (1 min)

Create file `.env.local` in project root:

```bash
VITE_AIRTABLE_API_KEY=patYourTokenHere123456789
VITE_AIRTABLE_BASE_ID=appYourBaseIdHere
VITE_AIRTABLE_TABLE_NAME=Projects
```

#### Step 3: Start App (1 min)

```bash
npm install
npm run dev
```

#### Step 4: Login & Use (1 min)

**Admin Login:**
- Email: `admin@entreprise.fr`
- Password: `admin123`

✅ **Done!** Your 78 real projects are now loaded from Airtable!

---

## 🔐 Two User Roles

### Admin Account
- **Email:** `admin@entreprise.fr`
- **Password:** `admin123`
- **Can:** Create, edit, delete projects

### Directeur Account (Read-only)
- **Email:** `directeur@entreprise.fr`  
- **Password:** `directeur123`
- **Can:** View only, no modifications

---

## 📊 Airtable Table Structure

**Your Airtable table MUST have these fields:**

| Field Name | Type | Example |
|------------|------|---------|
| name | Single line text | "Deployment Cloud Servers" |
| department | Single select | DSI, DAF, RH, DGP, DDEV |
| status | Single select | 9 options (see below) |
| priority | Single select | Haute, Moyenne, Basse |
| progress | Number | 75 |
| projectManager | Single line text | "Sophie Martin" |
| partners | Long text | "IT Team, Microsoft" |
| startDate | Date | 2026-01-15 |
| endDate | Date | 2026-03-30 |
| comments | Long text | "Project notes..." |
| isDelayed | Checkbox | ☑ or ☐ |

**Status options (9):**
1. Non démarré
2. En étude
3. En exécution
4. En attente de Go pour production
5. En production
6. En service
7. En pause
8. Clôturé
9. Abandonné

---

## 🚀 Deploy to Vercel (2 minutes)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Go to vercel.com
# 3. Import your GitHub repo
# 4. Add Environment Variables:
#    - VITE_AIRTABLE_API_KEY
#    - VITE_AIRTABLE_BASE_ID
#    - VITE_AIRTABLE_TABLE_NAME
# 5. Deploy!
```

**Done!** Your app is live at `https://yourproject.vercel.app`

---

## 🛠️ Troubleshooting

### "Airtable not configured" warning?
1. Check `.env.local` exists in project root
2. Restart dev server (`npm run dev`)
3. Variable names start with `VITE_`

### Can't login?
1. Try default credentials above
2. Check `.env.local` if you changed them
3. Clear browser cache (F12 > Application > Clear storage)

### Projects not loading from Airtable?
1. Check API token has correct permissions
2. Verify Base ID is correct (starts with `app`)
3. Table name matches exactly (case-sensitive)
4. Open console (F12) to see error details

---

## 📚 Full Documentation

- **`AIRTABLE_AUTH_README.md`** - Complete guide
- **`AIRTABLE_SETUP_GUIDE.md`** - Detailed Airtable setup
- **`WEWEB_EXPORT_GUIDE.md`** - WeWeb export (if needed)

---

## ✨ What You Get

✅ **Professional dashboard** with KPIs and charts  
✅ **Kanban board** with 9 status columns  
✅ **Timeline/Gantt** view  
✅ **Full CRUD** operations (Admin)  
✅ **Read-only mode** (Directeur)  
✅ **Live Airtable sync** (or demo mode)  
✅ **Responsive design** (desktop optimized)  
✅ **Production ready**

---

**That's it! Start building! 🚀**
