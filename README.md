# TaskFlow

Collaborative task management app (Next.js + Firebase), built from the SRS in [docs/SRS.md](docs/SRS.md).

## 1. Create a Firebase project

1. Go to https://console.firebase.google.com and create a project (Google Analytics optional).
2. **Authentication** → Sign-in method → enable **Email/Password** and **Google**.
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
You can also use **Continue with Google** — first-time Google sign-ins land on `/complete-profile`
to pick a display name and role (Google auth has no role field, unlike email/password signup).

### Firestore composite indexes

The task list queries filter by `createdBy`/`assigneeUid` and sort by `dueDate`, which Firestore
requires a composite index for. The first time each query runs against a fresh project, the
browser console will show a `FirebaseError: [code=failed-precondition]` with a direct link to
create the missing index — click it, wait ~1 minute for it to build, and the error clears on its
own. This only needs to happen once per Firebase project.

## 5. Deploy (GitHub + Vercel)

1. Push this repo to GitHub (create an empty repo at https://github.com/new, then `git remote add origin <url> && git push -u origin main`).
2. https://vercel.com → **Add New → Project** → import the GitHub repo.
3. Add the six `NEXT_PUBLIC_FIREBASE_*` values from `.env.local` under the project's
   **Environment Variables** before deploying — Vercel builds server-side and won't have your
   local `.env.local`.
4. Deploy. Vercel gives you a `*.vercel.app` URL (and lets you attach a custom domain later).
5. Firebase console → Authentication → Settings → **Authorized domains** → add the `*.vercel.app`
   domain (and your custom domain, once attached). Without this, login/signup fails with
   `auth/unauthorized-domain`.

## Status

MVP scope currently implemented: auth (signup/login/logout/password reset), task CRUD, personal list + manager dashboard, Kanban board with drag-and-drop, real-time sync. Gantt chart, Excel export, comments, and audit log are follow-up work (see `docs/SRS.md` sections 3.5–3.7).
