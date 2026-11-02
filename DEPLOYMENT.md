# Deploying Crown & Calendar

The production deployment is one Django web app. Django serves the exported
Next.js frontend and the `/api/` routes from the same hostname, while SQLite is
stored on persistent disk.

## Recommended free host: PythonAnywhere

1. Create a free Beginner account and clone this repository in a Bash console.
2. From the repository root, build the frontend:

   ```bash
   cd frontend && npm ci
   npm run build
   ```

3. Create a virtual environment and prepare Django:

   ```bash
   python -m venv .venv
   .venv/bin/pip install -r backend/requirements.txt
   .venv/bin/python backend/manage.py migrate
   .venv/bin/python backend/manage.py collectstatic --noinput
   .venv/bin/python backend/manage.py createsuperuser
   ```

4. In **Web**, add a manual Django web app, select the virtual environment, and
   point its WSGI file at `backend/config/wsgi.py`. Add the variables shown in
   `backend/.env.example` to the WSGI file before importing the application.
5. Reload the web app and open `https://YOUR_USERNAME.pythonanywhere.com`.

Sign in to the planner with the superuser created in step 3. The frontend sends
a short-lived JWT access token to the API and automatically rotates the refresh
token. Create additional users with `createsuperuser` or through Django admin;
each user receives an isolated set of tasks and crown days.

Generate a secret with:

```bash
python -c "import secrets; print(secrets.token_urlsafe(50))"
```

Run the static build and migrations again after pulling changes. Back up
`backend/db.sqlite3` before schema migrations or major releases.

## Docker hosts

The backend also includes a Gunicorn Dockerfile. SQLite is safe only when the
host provides a persistent disk and the app runs as a single instance. Set
`SQLITE_PATH` to the mounted disk path. Render's free web service has ephemeral
storage, so it is unsuitable for this SQLite configuration without a paid disk
or a switch to managed Postgres.
