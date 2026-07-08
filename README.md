# TaskFlow

Collaborative task management app (Next.js + Firebase), built from the SRS in [docs/SRS.md](docs/SRS.md).

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com and create a project (Google Analytics optional).
2. **Authentication** → Sign-in method → enable **Email/Password**.
3. **Firestore Database** → Create database → start in **production mode** (rules are provided below).
4. Project settings → General → "Your apps" → Add app → Web (`</>`) → copy the config values.

## 2. Configure environment

```bash
cp .env.local.example .env.local
```

Paste the values from the Firebase web app config into `.env.local`.

## 3. Firestore security rules

In the Firebase console → Firestore Database → Rules, paste the contents of
[`docs/firestore.rules`](docs/firestore.rules). It enforces:

- Any signed-in user can read the `users` directory (needed to populate the assignee picker) but can only write their own profile.
- Tasks are readable by their creator (manager) and their assignee.
- Only the creator (manager) can create/delete a task; the creator or the assignee can update it (status, comments).

## 4. Run

```bash
npm install
npm run dev
```

Open http://localhost:3000. Sign up as a **Manager** to create/assign tasks, or as an **Assignee** to work them.

## 5. Deploy to your own host (shared hosting / cPanel / FTP)

This app has no server-side code (no API routes, everything talks to Firebase directly from
the browser), so `next.config.ts` is set to `output: "export"`. Building produces a plain
static site in `out/` — no Node.js server needed on the host.

1. Make sure `.env.local` has your **real** Firebase config (the static export bakes these
   values into the JS bundle at build time).
2. Build:
   ```bash
   npm run build
   ```
3. Upload the **contents** of the generated `out/` folder (not the folder itself) to your
   host's public web root (e.g. `public_html/` on cPanel), via FTP/SFTP or your host's file
   manager.
4. In the Firebase console → Authentication → Settings → **Authorized domains**, add your
   site's domain (e.g. `yourdomain.com`). Without this, login/signup will fail with
   `auth/unauthorized-domain` once deployed.

Routes are exported as folders with `index.html` inside (e.g. `out/dashboard/index.html`),
which is what most static hosts (Apache/Nginx/cPanel) serve automatically when you visit
`/dashboard/`. If your host doesn't do this, enable directory-index serving or ask your host
how static SPA-style sites are served.

## Status

MVP scope currently implemented: auth (signup/login/logout/password reset), task CRUD, personal list + manager dashboard, Kanban board with drag-and-drop, real-time sync. Gantt chart, Excel export, comments, and audit log are follow-up work (see `docs/SRS.md` sections 3.5–3.7).
