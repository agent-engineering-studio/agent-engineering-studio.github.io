# Plausible Analytics — self-hosted

Il sito (su GitHub Pages) è statico e include lo snippet Plausible in
`src/layouts/BaseLayout.astro`:

```html
<script defer
  data-domain="agentengineering.it"
  src="https://analytics.agentengineering.it/js/script.js"></script>
```

GitHub Pages **non** può ospitare Plausible: serve un server esterno
(VPS Hetzner / DigitalOcean / Contabo / Railway / Fly.io / un homeserver
con reverse proxy). Sotto i passi per il self-hosting su un VPS Linux.

## 1. DNS

Punta `analytics.agentengineering.it` (record A o AAAA) all'IP del VPS.

## 2. Server: clona la Community Edition

Plausible mantiene un repo ufficiale con `docker-compose.yml`, immagini e
script di setup. Sul VPS:

```bash
git clone https://github.com/plausible/community-edition plausible-ce
cd plausible-ce
cp .env.example .env
```

Modifica `.env`:

- `BASE_URL=https://analytics.agentengineering.it`
- `SECRET_KEY_BASE=$(openssl rand -base64 48)`
- `TOTP_VAULT_KEY=$(openssl rand -base64 32)`
- (opzionale) `MAILER_*` per invito utenti via email

Avvia:

```bash
docker compose up -d
```

Plausible ascolta sulla porta `8000` del container.

## 3. Reverse proxy + HTTPS

Esponi `analytics.agentengineering.it` con Caddy / Nginx / Traefik e un
certificato Let's Encrypt. Esempio Caddy (`/etc/caddy/Caddyfile`):

```caddy
analytics.agentengineering.it {
  reverse_proxy localhost:8000
}
```

## 4. Crea il sito nella dashboard

1. Vai su `https://analytics.agentengineering.it`
2. Crea il primo utente (diventa admin)
3. Aggiungi un sito con dominio `agentengineering.it`
4. Lo snippet è già nel sito: dopo il prossimo deploy GitHub Pages,
   Plausible inizia a ricevere eventi.

## 5. Verifica

- Apri `https://agentengineering.it/` in incognito
- Network tab → deve esserci una `POST` verso
  `analytics.agentengineering.it/api/event` con status `202`
- Dashboard Plausible → "Current visitors" dovrebbe salire a 1

## Note

- Plausible è cookie-less e GDPR-friendly → **nessun banner cookie
  richiesto** finché resti sulla configurazione di default.
- Per bloccare gli ad-blocker che filtrano `plausible.io`, il fatto che
  lo script sia servito dal tuo dominio (`analytics.agentengineering.it`)
  aiuta ma non garantisce. Per il proxy via Cloudflare Worker / Pages
  Function vedi i docs ufficiali.
- Backup: snapshotta il volume Postgres + ClickHouse (vedi
  `docker-compose.yml` della CE).

## Riferimenti

- Repo ufficiale: <https://github.com/plausible/community-edition>
- Docs self-hosting: <https://plausible.io/docs/self-hosting>
