# Deploy to PythonAnywhere (free Beginner plan)

This application deploys as one same-origin Django site: Django handles `/api/`
and serves the compiled React application from `frontend/dist`. SQLite is kept
on PythonAnywhere's persistent filesystem. No Node.js process or CORS setup is
needed in production.

Replace `YOUR_USERNAME` below with your PythonAnywhere username.

## 1. Prepare and push from your computer

Build the frontend and commit the complete application, including
`frontend/dist`:

```bash
cd /Users/nataliechan/Desktop/projects/planner/frontend
npm ci
npm run build
cd ..
git add .
git commit -m "Prepare PythonAnywhere production deployment"
git push origin main
```

Never commit `backend/.env`, `backend/db.sqlite3`, or a real secret key.

## 2. Clone on PythonAnywhere

Create a free account, open a Bash console, and run:

```bash
cd ~
git clone https://github.com/Natkuma01/schedular.git planner
cd ~/planner
python3.13 -m venv .venv
.venv/bin/pip install --no-cache-dir -r backend/requirements.txt
mkdir -p data
```

If Python 3.13 is not offered when creating the web app, use the newest Python
version shown there for both the virtual environment and the web app.

## 3. Configure production values

Generate a secret in the Bash console:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

In PythonAnywhere, open **Web**, choose **Add a new web app**, select **Manual
configuration**, and choose the same Python version as the virtual environment.

Set the virtualenv field to:

```text
/home/YOUR_USERNAME/planner/.venv
```

Open the WSGI configuration file from the Web page and replace its contents:

```python
import os
import sys

project = "/home/YOUR_USERNAME/planner/backend"
if project not in sys.path:
    sys.path.insert(0, project)

os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings"
os.environ["DJANGO_SECRET_KEY"] = "PASTE_YOUR_GENERATED_SECRET"
os.environ["DJANGO_DEBUG"] = "false"
os.environ["DJANGO_ALLOWED_HOSTS"] = "YOUR_USERNAME.pythonanywhere.com"
os.environ["DJANGO_CSRF_TRUSTED_ORIGINS"] = "https://YOUR_USERNAME.pythonanywhere.com"
os.environ["DJANGO_TIME_ZONE"] = "America/New_York"
os.environ["SQLITE_PATH"] = "/home/YOUR_USERNAME/planner/data/db.sqlite3"

from config.wsgi import application
```

## 4. Initialize Django

Back in the Bash console:

```bash
cd ~/planner
.venv/bin/python backend/manage.py migrate
.venv/bin/python backend/manage.py collectstatic --noinput
.venv/bin/python backend/manage.py check --deploy
.venv/bin/python backend/manage.py createsuperuser
```

The superuser is optional for normal registration but gives you access to
`/admin/`.

## 5. Configure static files

On the PythonAnywhere **Web** page, add these mappings:

```text
URL: /assets/
Directory: /home/YOUR_USERNAME/planner/frontend/dist/assets

URL: /static/
Directory: /home/YOUR_USERNAME/planner/backend/staticfiles
```

Do not map `/` as static; Django serves `index.html` and the API.

Click **Reload**, then open:

```text
https://YOUR_USERNAME.pythonanywhere.com
```

Check the health endpoint at `/api/health/`, create an account, add a task, sign
out and back in, and confirm that the task remains.

## Updating the site

Build and push the frontend from your computer first. Then on PythonAnywhere:

```bash
cd ~/planner
git pull --ff-only
.venv/bin/pip install --no-cache-dir -r backend/requirements.txt
.venv/bin/python backend/manage.py migrate
.venv/bin/python backend/manage.py collectstatic --noinput
```

Finally click **Reload** on the Web page.

## Backups and free-plan limits

Download `~/planner/data/db.sqlite3` regularly from the Files page. The free
plan has one worker, 512 MiB disk space, and requires monthly web-app renewal.
Do not upload `frontend/node_modules`; the committed `frontend/dist` is enough.
