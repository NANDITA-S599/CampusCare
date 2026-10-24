# Architecture notes

- `client/` contains the React SPA, routes, components, forms, charts and responsive styling.
- `server/` contains Express API routes, JWT middleware, upload handling and MySQL pool setup.
- `database/schema.sql` creates the normalized database and indexes.
- `server/src/seed.js` creates development demo departments/users and a few example complaints.
- `complaint_history` stores status and assignment events for traceability.
- `feedback` enforces one feedback row per complaint with a unique constraint.
- Complaint ownership and department access are enforced by the API, not just the frontend.

## Category routing defaults

| Category | Default department |
|---|---|
| Infrastructure | Facilities |
| Wi-Fi & IT | IT Support |
| Cleanliness | Housekeeping |
| Transport | Transport |
| Electrical | Facilities |
| Water & Plumbing | Facilities |
| Safety | Campus Security |
| Other | Administration |

## Priority SLA targets

| Priority | Target |
|---|---:|
| Urgent | 8 hours |
| High | 24 hours |
| Medium | 72 hours |
| Low | 120 hours |

These are sample targets for the project demonstration and can be adjusted in `server/src/utils/tickets.js` and `server/src/routes/dashboard.js`.
