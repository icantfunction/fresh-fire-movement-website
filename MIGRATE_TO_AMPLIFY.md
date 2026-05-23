# Migrate Hosting: Lovable → AWS Amplify

Why: backend is already on AWS (API Gateway + Lambda + Cognito + DynamoDB + S3),
Lovable's one-way GitHub sync requires a manual "Pull from GitHub" every time
we push externally, and Amplify auto-deploys on every push to `main` with no
manual step. Estimate: 20–30 min if no custom domain, 30–60 min with domain.

Do NOT shut Lovable off until Amplify is fully verified — keep it as a
fallback during DNS propagation.

---

## Pre-flight (2 min)

- [ ] Confirm the current live URL on Lovable.
- [ ] Note whether the site uses a custom domain or the default
      `*.lovable.app` subdomain. (If custom: have registrar login ready.)
- [ ] Confirm AWS account `279630655712` is the one we want to host under
      (same account as the existing API Gateway / Lambda / Cognito stack
      in `us-east-1`).

## 1. Create the Amplify Hosting app (5 min)

- [ ] AWS Console → **Amplify** → **Create new app** → **Host web app**.
- [ ] Choose **GitHub** → authorize if first time.
- [ ] Repository: `icantfunction/fresh-fire-movement-website`. Branch: `main`.
- [ ] Amplify should auto-detect **Vite**. Confirm the build settings:
  - Build command: `npm run build`
  - Output directory: `dist`
  - Node version: 20 (set explicitly under app settings → build settings if needed)
- [ ] App name: `fresh-fire-movement-website` (or whatever, just consistent).
- [ ] Skip the "Add backend" prompt — backend is already deployed manually.

## 2. Environment variables (CRITICAL — 3 min)

Amplify build does NOT read `.env` from the repo (it's gitignored anyway).
Set these in **App settings → Environment variables**:

- [ ] `VITE_API_BASE` = `https://y5w6n0i9vc.execute-api.us-east-1.amazonaws.com/prod`
- [ ] `VITE_COGNITO_USER_POOL_ID` = `us-east-1_TkrYyBz2T`
- [ ] `VITE_COGNITO_CLIENT_ID` = `5a0jpdmleoq56l76otr1udlue5`
- [ ] `VITE_AWS_REGION` = `us-east-1`

Without these the build will succeed but the live app will fail on every API
call and admin sign-in.

## 3. SPA rewrite rule (CRITICAL — 1 min)

React Router routes (`/about`, `/meet-the-team`, `/admin`, `/media-upload`,
`/media-archive`) will 404 on direct hit without this. In **App settings →
Rewrites and redirects**, add:

| Source                                                                  | Target          | Type           |
|-------------------------------------------------------------------------|-----------------|----------------|
| `</^[^.]+$\|\.(?!(css\|gif\|ico\|jpg\|js\|png\|txt\|svg\|woff\|woff2\|ttf\|map\|json\|webp)$)([^.]+$)/>` | `/index.html`   | 200 (Rewrite)  |

(Amplify's default React/Vue/Angular SPA pattern — there's usually a one-click
"Add SPA rewrite" preset.)

## 4. First deploy (~5 min)

- [ ] Click **Save and deploy**. Watch the build log:
  - Provision (~30s)
  - Build (~3 min) — npm ci using `package-lock.json` (bun.lockb is ignored)
  - Deploy (~30s)
- [ ] Open the Amplify-issued URL (e.g. `https://main.d1xxx.amplifyapp.com`).
- [ ] Smoke test: hero loads, countdown ticks, navigate to `/about`,
      `/meet-the-team`, refresh on those routes (rewrite check), open
      `/admin` and sign in with Cognito, submit a test audition signup
      (delete from DynamoDB after).

## 5. CORS / Cognito callback updates (5 min)

The new Amplify domain is a new origin. Two things to check:

- [ ] **API Gateway CORS** — if `y5w6n0i9vc` has explicit allowed origins
      (not `*`), add the Amplify domain. Check console → APIs → CORS.
- [ ] **S3 media bucket CORS** — `ffdm-captured-in-movement-279630655712`
      uses `infra/aws/media-bucket-cors.json`. Diff it; if it has a specific
      origin list, append the Amplify domain (and later the custom domain).
- [ ] **Cognito User Pool** — App client `5a0jpdmleoq56l76otr1udlue5`.
      If callback URLs are configured (Hosted UI), add the Amplify domain.
      If using just the SDK with username/password flow (likely — check
      `src/lib/cognito.ts`), no change needed.

## 6. Custom domain (skip if using Amplify subdomain) (10–60 min)

- [ ] Amplify → **Domain management** → **Add domain**.
- [ ] Enter the apex domain. Amplify issues an ACM cert and gives you DNS
      records (CNAME or nameserver delegation depending on your setup).
- [ ] At your registrar:
  - **Route 53**: easiest — let Amplify create the hosted zone, point
    nameservers to Route 53.
  - **External registrar**: add the CNAME records Amplify provides. Keep
    Lovable's records in place for now — the Amplify cert validates via
    a separate CNAME so this doesn't break the Lovable site.
- [ ] Wait for cert issue + DNS propagation (5 min to 24 hr, typically
      <30 min for CNAME, longer for full nameserver delegation).
- [ ] Once Amplify shows "Available" with green check, the domain is live.

## 7. Cutover (1 min)

Only after Amplify domain is verified working end-to-end:

- [ ] Update the registrar's primary A/CNAME for the apex/www to point at
      Amplify (if not already done via NS delegation).
- [ ] Wait one more propagation cycle.
- [ ] Confirm `https://<your-domain>` serves from Amplify (check response
      headers for `x-amz-cf-*` from CloudFront — Amplify's CDN).

## 8. Decommission Lovable (after 1 week of verified Amplify uptime)

- [ ] In Lovable, disconnect the GitHub repo so future Lovable edits don't
      accidentally push to the now-Amplify-deployed repo.
- [ ] Archive or delete the Lovable project.
- [ ] Update `CLAUDE.md` / `README.md` to note the new hosting setup.
- [ ] Note in memory that the project is now Amplify-hosted, deploys on
      push to `main`, no manual sync step needed.

---

## Future-state benefit

After migration, the workflow is just:

```
git add .
git commit -m "..."
git push origin main
```

Amplify auto-builds and deploys in ~3–5 min. No manual "Pull from GitHub"
step in any UI ever again.
