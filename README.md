# Northline Studio — business website foundation

This build turns Northline Studio into a multi-page business site rather than a single portfolio page.

## Frontend
Open `index.html` for the site. Pages include Home, Work, Design Evolution case study, Chart Academy case study, Services, Studio, Process, Contact, Privacy, Terms and 404.

For local testing with working relative assets, run from this folder:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Lead backend
The backend is an ASP.NET Core `net10.0` API using EF Core + SQLite for a simple zero-config local database.

From `backend/Northline.Api`:

```bash
dotnet restore
dotnet run
```

It runs at `http://localhost:5078`. The public form POSTs to `/api/leads`. The API stores a lead, generates an `NL-YYYY-####` reference, supports SMTP notification when configured, and rate-limits contact submissions.

Change `AdminKey` in `appsettings.json` before any real deployment. Configure `AllowedOrigins` for the final domain and enable SMTP only after adding real credentials via environment variables or a secret store.

## Admin prototype
Open `/admin/index.html` while the API is running. Enter the admin key to view leads. This is intentionally a lightweight CRM prototype. Production admin authentication and full lead status editing should be implemented before public deployment.

## Production recommendations
- Buy a Northline domain and use a domain email address.
- Host frontend on Netlify/Vercel/Cloudflare Pages or alongside the API.
- Host the .NET API on Azure App Service, Render, Railway or another .NET-capable host.
- Replace SQLite with PostgreSQL or Azure SQL when moving to production if preferred.
- Put all SMTP/database/admin secrets in environment variables, never source control.
- Add Cloudflare Turnstile, analytics, Search Console and structured data at launch.
- Add genuine testimonials only after clients provide them.
