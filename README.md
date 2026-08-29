# EPR Check — final project v1

Jedinstvena verzija projekta spremna za GitHub -> Netlify deploy.

## Glavni dijelovi
- `index.html` — SEO landing, EPR Check, EPR Report ponuda, FAQ i Netlify lead forma.
- `packaging-calculator.html` — besplatni Packaging Calculator (CSV/Excel + OCR za slike; PDF skeniranje je ograničeno u MVP-u).
- `report-engine.js` — market data za EPR Check / Report draft.
- `report-draft.html` — radni draft Reporta.
- `admin.html` — privatni admin dashboard.
- `netlify/functions/` — server-side dohvat prijava i izrada/odobravanje Reporta.
- `index-integration.js` — prijenos rezultata kalkulatora u postojeći EPR Report obrazac.

## Deploy
1. Spojiti repo na Netlify.
2. Build command ostaviti praznim; publish directory `.`.
3. Netlify Functions su u `netlify/functions`.
4. U Netlify uključiti Identity.
5. Admin korisniku dodijeliti `admin` role.
6. U Environment variables dodati `NETLIFY_AUTH_TOKEN` kao secret dostupnu Functions runtimeu. `SITE_ID` Netlify daje kao read-only runtime varijablu.
7. Redeploy nakon promjene environment varijabli.

## Sigurnost
API token nije u repozitoriju. Admin Functions provjeravaju prijavu i `admin` role server-side.

## Plaćanje
Revolut još nije spojen. To je namjerno sljedeća faza nakon provjere GitHub -> Netlify deploya.
