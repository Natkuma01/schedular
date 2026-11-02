# Planner

Full-stack planner organized as a monorepo:

- `frontend/` — Vite and React application
- `backend/` — Django API, JWT authentication, and SQLite database
- `Dockerfile` — production build for both applications
- `DEPLOYMENT.md` — deployment instructions

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
