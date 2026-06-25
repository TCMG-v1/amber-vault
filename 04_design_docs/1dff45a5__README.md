# Red Gate Dao Knowledge Base API

Status: working document until commit.

This service is a Velma-facing knowledge node for Red Gate Dao / Graft Memory OS.

It provides a small REST API for storing, updating, soft-archiving, and committing knowledge items.

## Kernel law

Everything is playable until commit; nothing is authoritative until memory writes it.

## Run

```bash
npm install
npm start
```

Default backend:

```bash
KB_BACKEND=json npm start
```

SQLite backend:

```bash
KB_BACKEND=sqlite npm start
```

## Routes

```text
GET    /health
GET    /api/knowledge
GET    /api/knowledge/:id
POST   /api/knowledge
PATCH  /api/knowledge/:id
POST   /api/knowledge/:id/commit
DELETE /api/knowledge/:id
```

## Create item

```bash
curl -X POST http://localhost:4000/api/knowledge \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Red Gate Dao",
    "content": "The chain is the spine.",
    "tags": ["os", "chain"],
    "role": "Archivist"
  }'
```

## Commit item

```bash
curl -X POST http://localhost:4000/api/knowledge/kb-id/commit \
  -H 'Content-Type: application/json' \
  -d '{"actor":"Velma","note":"Reviewed and committed."}'
```

## Notes

- Delete is implemented as soft archive in the API route.
- The JSON and SQLite stores both preserve the full item payload including audit history.
- This is a local working service, not production auth/security.

