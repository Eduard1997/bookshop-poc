# Bookshop POC

Internal 8-week POC: ONIX book data → Emporix (commerce) → Payload CMS (storefront + editorial content).

See `docs/project-brief.md` for the full brief — architecture, scope, and milestones.

## Repo layout

```
bookshop-poc/
├─ compose.yaml        # local Postgres (for Payload)
├─ .env.example        # copy to .env and fill in
├─ importer/           # ONIX → Emporix importer (added week 1–3)
├─ payload-app/        # Payload 3 storefront + admin (added week 1)
└─ docs/
   └─ project-brief.md
```

`importer/` and `payload-app/` are scaffolded in week 1 — not present yet.

## Local setup

**1. Start Postgres**

```bash
docker compose up -d
docker compose ps
```

You should see `db` with status `Up`. If not, check `docker compose logs db`.

**2. Copy the environment file**

```bash
cp .env.example .env
```

Fill in the Emporix credentials — ask your mentor. Never commit `.env` (it's already in `.gitignore`).

**3. Verify the database connection**

```bash
docker compose exec db psql -U postgres -d bookshop -c "SELECT version();"
```

Should print the Postgres version. If you get `no configuration file provided`, make sure you're running the command from this folder — `compose.yaml` has the standard name so `docker compose` finds it automatically, no `-f` flag needed.

**4. Payload app** (once scaffolded)

```bash
cd payload-app
pnpm install
pnpm dev
```

`/admin` should load, plus one page under `(frontend)`.

## Conventions

- Feature branches, small commits with real messages — no `final` or `wip` commits.
- Every PR gets reviewed by the other student before merging, even across the FE/BE split from week 4 onward.
- If you're stuck for more than half a day, say so at standup. That's what it's for.

## Stack

| Layer | Technology |
|---|---|
| Commerce | Emporix (provided tenant) |
| Storefront + CMS | Payload CMS 3 |
| Editorial database | PostgreSQL 16 (Docker) |
| Importer | TBD — decided week 1, see `importer/DECISION.md` once written |
