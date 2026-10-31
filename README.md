# Natalie's Calendar

A cheerful, dark-mode weekly and monthly planner built with React and Vite.

- **Week view:** a vertical list, one row per day (Monday to Sunday), with every task listed under each other. Click **Edit** to drag tasks between days, edit or delete them, and crown successful days.
- **Month view:** category names in their colors, plus crowns.
- **Categories:** Networking Events, Learning, Project time, Job Hunt, House work, Others. Each one asks its own question.
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
    NameModal.jsx         change the name in the header
    Celebration.jsx       5-crown confetti pop-up
    Icons.jsx             category icons, crown and cat artwork
  lib/
    config.js             categories, colors, dropdown options, prompts
    dates.js              date helpers (weeks start on Monday)
    tasks.js              sorting, titles, example data
    storage.js            saving to localStorage
  styles.css              all styling and colors
```

To change dropdown options or category colors, edit `src/lib/config.js`.
# schedular
