---
title: "Spotify-play-history"
description: "Spotify play history poller for collecting long term music preferences"
date: "May 21 2026"
repoURL: "https://github.com/mattejones/spotify-playhistory-tool/"
---

# Spotify History Collector

Collects and stores your Spotify listening history in a local SQLite database. Runs as a background service, polling the Spotify API every 5 minutes. Supports a catchup mode to backfill up to 7 days of history if the service falls behind. 

One idea I had was to then take this data and then try to automate the purchasing of CDs with my favourite tracks on ebay or something. 

---

## Prerequisites

- Java 17+
- A Spotify account
- A registered app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

---

## Spotify App Setup

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create an app.
2. Under **Settings → Redirect URIs**, add:
   ```
   http://127.0.0.1:8080/api/callback
   ```
   > Spotify requires an explicit loopback IP (not `localhost`) for HTTP redirect URIs as of April 2025.
3. Note your **Client ID** and **Client Secret**.

---

## Configuration

All configuration is via environment variables. There are no files to edit.

| Variable | Required | Default | Description |
|---|---|---|---|
| `SPOTIFY_CLIENT_ID` | Yes | — | From the Spotify Developer Dashboard |
| `SPOTIFY_CLIENT_SECRET` | Yes | — | From the Spotify Developer Dashboard |
| `SPOTIFY_REDIRECT_URI` | No | `http://127.0.0.1:8080/api/callback` | Must match the URI registered in the dashboard |
| `SQLITE_URL` | No | `jdbc:sqlite:history.db` | Path to the SQLite database file |

---

## Building

```bash
./mvnw package
```

The executable jar is produced at `target/spotify-playhistory-tool-0.1.jar`.

---

## Running Locally

**1. Set environment variables**

On Linux/macOS:
```bash
export SPOTIFY_CLIENT_ID=your_client_id
export SPOTIFY_CLIENT_SECRET=your_client_secret
```

On Windows (PowerShell):
```powershell
$env:SPOTIFY_CLIENT_ID = "your_client_id"
$env:SPOTIFY_CLIENT_SECRET = "your_client_secret"
```

**2. Start the application**

```bash
java -jar target/spotify-playhistory-tool-0.1.jar
```

**3. Authenticate**

Open `http://127.0.0.1:8080/api/login` in your browser. You will be redirected to Spotify to approve access. After approval, Spotify redirects back and the app begins collecting history immediately.

The access and refresh tokens are persisted to the database. Subsequent restarts will restore the token automatically — no re-authentication needed unless you revoke access in Spotify.

---

## Deploying to a Headless Server

The OAuth flow requires a browser, so initial authentication must be done on a machine with one. The token is then carried to the server via the database.

**Step 1 — Authenticate locally**

Follow the _Running Locally_ steps above. Once the first collection run completes successfully (check the logs), the token is persisted.

**Step 2 — Copy files to the server**

```bash
scp target/spotify-playhistory-tool-0.1.jar user@server:/opt/spotify-history/
scp history.db user@server:/opt/spotify-history/
```

**Step 3 — Configure environment on the server**

Set `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in the server's environment. For a systemd service:

```ini
# /etc/systemd/system/spotify-history.service
[Unit]
Description=Spotify History Collector
After=network.target

[Service]
Type=simple
User=spotify
WorkingDirectory=/opt/spotify-history
Environment="SPOTIFY_CLIENT_ID=your_client_id"
Environment="SPOTIFY_CLIENT_SECRET=your_client_secret"
Environment="SQLITE_URL=jdbc:sqlite:/opt/spotify-history/history.db"
ExecStart=/usr/bin/java -jar /opt/spotify-history/spotify-playhistory-tool-0.1.jar
Restart=on-failure
RestartSec=30

[Install]
WantedBy=multi-user.target
```

**Step 4 — Enable and start**

```bash
sudo systemctl daemon-reload
sudo systemctl enable spotify-history
sudo systemctl start spotify-history
sudo journalctl -u spotify-history -f
```

The service will use the persisted token from the copied database and refresh it automatically. No browser or re-authentication is needed on the server.

---

## Logs

Logs are written to both the console and `logs/app.log`, rotating daily (or at 10 MB). Up to 10 compressed log files are kept with a 200 MB total cap.

```
logs/
  app.log                  ← current
  app.2026-05-18.0.log.gz  ← previous days
  ...
```

---

## Database Schema

SQLite database at `history.db` (or the path set by `SQLITE_URL`).

| Table | Description |
|---|---|
| `artists` | Artist name and Spotify ID |
| `albums` | Album name, Spotify ID, release date |
| `tracks` | Track name, duration, album reference |
| `track_artists` | Track-to-artist mapping |
| `play_history` | Timestamp and context for each play event |
| `processing_state` | Internal cursor tracking the last successfully processed timestamp |
| `spotify_tokens` | Persisted OAuth tokens for restart recovery |

---

## Package Structure

```
xyz.mej.apps
├── api          HTTP controllers (/api/login, /api/callback, /api/history)
├── config       Spotify and SQLite configuration beans
├── core
│   ├── model    Domain entities (AppPlayHistory)
│   └── validator Input validation
├── dto          Data transfer objects
├── job          Scheduled collection job (runs every 5 minutes)
├── repository   Token persistence (SQLite and in-memory)
├── service      Business logic — auth, history fetch, DB writes, state tracking
└── util         PKCE utilities
```
