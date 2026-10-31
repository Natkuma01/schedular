# Natalie's Calendar

A cheerful, dark-mode weekly and monthly planner built with React and Vite.

- **Week view:** a vertical list, one row per day (Monday to Sunday), with every task listed under each other. Click **Edit** to drag tasks between days, edit or delete them, and crown successful days.
- **Month view:** category names in their colors, plus crowns.
- **Categories:** start with Networking Events, Learning, Project time, Job Hunt, House work, Others. In **Add task → Edit categories** you can rename them, change their question, color and icon, add new ones, or delete unused ones. Each category has a type:
  - **Event** — text plus a start and end time.
  - **Dropdown** — an all-day task picked from a list. Add options in the category editor, or with **+ Add option** right in the task form.
  - **Count** — a whole number, e.g. how many job applications.
  - **Other** — text, with an optional start and end time.
- **5 crowns in a week** sets off a celebration.
- Click the cat to change the name at the top.
- Data is saved in your browser (localStorage) on this device.

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173).

## Build for production

```bash
npm run build     # outputs to dist/
npm run preview   # serves the built app locally
```

## Put it on GitHub

Create an empty repository named `natalies-calendar` on GitHub (no README, no .gitignore), then from this folder run:

```bash
git remote add origin https://github.com/<your-username>/natalies-calendar.git
git branch -M main
git push -u origin main
```

## Publish it as a website (GitHub Pages)

This repo includes `.github/workflows/deploy.yml`, which builds and publishes the app on every push to `main`.

1. On GitHub, open the repo's **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push a commit (or re-run the workflow from the **Actions** tab).

Your calendar will be live at `https://<your-username>.github.io/natalies-calendar/`.

## Project structure

```
src/
  App.jsx                 page layout, state, crowns and celebrations
  components/
    WeekView.jsx          vertical list of days, drag and drop, crown toggles
    MonthView.jsx         month grid with category pills and crowns
    TaskCard.jsx          one task row
    TaskModal.jsx         add / edit task (category-specific questions)
    CategoryEditor.jsx    create / rename / delete categories and their dropdown options
    NameModal.jsx         change the name in the header
    Celebration.jsx       5-crown confetti pop-up
    Icons.jsx             category icons, crown and cat artwork
  lib/
    config.js             category types, default categories, colors and icons
    dates.js              date helpers (weeks start on Monday)
    tasks.js              sorting, titles, example data
    storage.js            saving to localStorage
  styles.css              all styling and colors
```

Category changes are saved in the browser. To change the starting categories for new visitors, edit `DEFAULT_CATS` in `src/lib/config.js`.
# schedular
