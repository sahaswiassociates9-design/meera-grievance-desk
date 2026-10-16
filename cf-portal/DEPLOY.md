# Meera Shantivanam Grievance Desk — Cloudflare deployment

Everything below is done in the Cloudflare dashboard and on GitHub, in a browser. No command line. About 15–20 minutes. Free tier is more than enough for a 500-flat society.

Why this setup: the site and the database live in your Cloudflare account, which is a developer platform, not a consumer mail account. It is not subject to the kind of automated suspension that hit the Gmail account. Use a real, long-standing email address when signing up (it does not need to be Gmail).

## Part 1 — Put the code on GitHub (5 min)

1. Sign in or sign up at https://github.com (any email).
2. Click **+** (top right) → **New repository**. Name: `meera-grievance-desk`. Leave it **Public** or make it Private, either works. Click **Create repository**.
3. On the new repository page click **uploading an existing file**.
4. Unzip `cf-portal.zip` on your computer and drag these into the upload box, **keeping the folder structure**:
   - `public/index.html`
   - `functions/api/_lib.js`, `functions/api/list.js`, `functions/api/submit.js`, `functions/api/close.js`
   - `schema.sql`
   - `wrangler.toml`
   (Easiest: drag the whole unzipped folder's *contents* in one go. GitHub keeps the subfolders.)
5. Click **Commit changes**.

## Part 2 — Create the database (3 min)

1. Sign in or sign up at https://dash.cloudflare.com.
2. Left menu → **Storage & Databases** → **D1 SQL Database** → **Create Database**. Name: `meera-grievances`. Click **Create**.
3. On the database page open the **Console** tab. Paste the entire contents of `schema.sql` and click **Execute**. You should see "Success".
4. On the same page, copy the **Database ID** (a long string under the database name). You need it in the next part.

## Part 3 — Connect the database to the code (2 min)

1. Back on GitHub, open `wrangler.toml` in your repository and click the pencil (edit) icon.
2. Replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with the Database ID you copied. Keep the quotes.
3. Click **Commit changes**.

## Part 4 — Deploy the site (5 min)

1. Cloudflare dashboard → **Compute (Workers)** → **Workers & Pages** → **Create** → **Pages** tab → **Connect to Git**.
2. Authorise Cloudflare to see your GitHub account and pick the `meera-grievance-desk` repository. Click **Begin setup**.
3. Project name: `meera-grievance-desk` (this becomes the URL). Framework preset: **None**. Build command: leave **empty**. Build output directory: `public`.
4. Click **Save and Deploy**. Wait for the green tick (about a minute).
5. Open the project → **Settings** → **Bindings** (or **Functions** on older dashboards) → **Add binding** → **D1 database**. Variable name: `DB`. Database: `meera-grievances`. Save.
6. Go to **Deployments** → on the latest deployment click **⋯ → Retry deployment** so the binding takes effect.

Your public link is **https://meera-grievance-desk.pages.dev**. Open it in a private window, log a test ticket, check it on the board, close it with the same mobile number.

## Changing things later

- Edit `public/index.html` on GitHub (phases, categories, notices) → Commit. Cloudflare redeploys automatically within a minute. The URL never changes.
- The 5-tickets-per-day limit is `MAX_PER_PHONE_PER_DAY` in `functions/api/_lib.js`.
- To see all tickets with full mobile numbers: D1 database → **Console** → `SELECT * FROM tickets ORDER BY ts DESC;`
- To delete a test ticket: `DELETE FROM tickets WHERE id = 'GRV-XXXX-XXXX';`
- Optional: add a custom domain under the Pages project → **Custom domains**.

## If something fails

- "Internal error" when logging a ticket → the DB binding is missing (Part 4, step 5) or the schema was not executed (Part 2, step 3).
- Page loads but board stays on "Couldn't load the register" → same as above.
- Build fails → check that `public/index.html` and the `functions/api` folder are at the top level of the repository, not inside an extra folder.
