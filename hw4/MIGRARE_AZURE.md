# Migrare la Azure

Acest proiect a fost migrat de la Google Cloud Platform la Microsoft Azure.

## Resurse Azure necesare

1. **Azure Database for PostgreSQL** - pentru baza de date
2. **Azure Storage Account** - pentru stocarea imaginilor de profil
3. **Azure App Service** - pentru backend (API)
4. **Azure Static Web Apps** - pentru frontend

## Pași de migrare

### 1. Configurare Azure Database for PostgreSQL

- Creează un server PostgreSQL în Azure Portal
- Setează variabilele de mediu în App Service:
  - `DB_HOST`: hostname-ul bazei de date
  - `DB_USER`: username
  - `DB_PASSWORD`: parola
  - `DB_NAME`: numele bazei de date
  - `DB_PORT`: 5432

### 2. Configurare Azure Storage Account

- Creează un Storage Account
- Creează un container numit `profile-pictures`
- Setează `AZURE_STORAGE_CONNECTION_STRING` în variabilele de mediu ale App Service

### 3. Deploy backend

- În Azure Portal, creează un App Service pentru Node.js
- Configurează deployment din GitHub sau încarcă manual
- Setează variabilele de mediu:
  - `JWT_SECRET`: secret pentru JWT
  - `CORS_ORIGINS`: URL-urile permise (inclusiv URL-ul Static Web App)
  - `AUTH_COOKIE_SAME_SITE`: 'none' pentru HTTPS

### 4. Deploy frontend

- Creează Azure Static Web App
- Configurează build location: `/frontend`
- Output location: `dist`

### 5. Rulare migrații

După deploy backend, rulează migrațiile:

```bash
cd backend
npm run migrate
```

## Modificări făcute

- Înlocuit Google Cloud Storage cu Azure Blob Storage
- Eliminat Google Cloud Logging (înlocuit cu console.log)
- Actualizat schema bazei de date pentru profile_pictures
- Creat fișiere de deployment pentru Azure