# Planner

Full-stack planner organized as a monorepo:

- `frontend/` — Vite and React application
- `backend/` — Django API, JWT authentication, and per-user SQLite persistence
- `Dockerfile` — production build for both applications
- `DEPLOYMENT.md` — deployment instructions

The production deployment is a single same-origin Django web app: Django serves
the compiled React files from `frontend/dist` and handles `/api/`. Planner data
is stored in SQLite, not browser storage. See `DEPLOYMENT.md` for the complete
PythonAnywhere free-plan procedure.

## Local development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
python -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py createsuperuser
.venv/bin/python manage.py runserver
```
