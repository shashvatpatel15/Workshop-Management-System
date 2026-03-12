# Workshop Hub (College Workshop Management)

A simple front-end web app for colleagues to **search workshops from different college clubs** and **register** for the ones they are interested in.

This version is **front-end only** (no server/database). Registrations are stored in the browser's `localStorage` on each device.

## How to run

1. Open the project folder:
   - `d:\MY PROJECTS\Workshop Management System\`
2. Double-click `index.html` to open it in your browser (Chrome/Edge/etc.).
3. You should see the **Workshop Hub** interface.

No extra setup, server, or dependencies are needed.

## Features

- **Search bar**  
  - Search by workshop title, club, or topics.

- **Filters**
  - Filter by **club** from the dropdown.
  - Filter by date: **Any date / Upcoming / This week / This month**.
  - Filter by **topic chips** (e.g. UI/UX, JavaScript, ML, etc.).

- **Workshop cards**
  - Shows club, level, date & time, location, duration, topics.
  - Capacity bar with registered vs. total seats.
  - Remaining spots or **Full** status.
  - Switch between **grid** and **list** view.

- **Registration**
  - Click **Register** on any open workshop.
  - Fill in:
    - Name
    - College email
    - Department
    - Year
    - Notes (optional)
  - Registration is saved to `localStorage` on that browser.
  - A small counter in the footer shows how many registrations have been saved on this device.

## Notes / Next steps

- Currently, this is **not connected to a real backend**.  
  To make it production-ready for your college:
  - Add a backend (Node/Express, Django, etc.).
  - Store workshops and registrations in a real database.
  - Add an admin panel for clubs to create and manage their own workshops.

