# Auth deployment notes

## Environment variables

Public browser-safe variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key.
- `NEXT_PUBLIC_SITE_URL`: canonical app URL for auth redirects, for example `http://localhost:3000` locally or `https://your-beta-domain.com` in production.
- `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH`: set to `true` only after Google OAuth is enabled in Supabase. Defaults to hidden/off when unset or `false`.

Server-only variables such as `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to the browser or prefixed with `NEXT_PUBLIC_`.

## Supabase email auth settings

In Supabase Dashboard -> Authentication -> URL Configuration:

- Site URL:
  - Local: `http://localhost:3000`
  - Beta/prod: `https://your-beta-domain.com`
- Redirect URLs:
  - Local: `http://localhost:3000/auth/callback`
  - Beta/prod: `https://your-beta-domain.com/auth/callback`
  - Add preview URLs only if you intentionally test auth on preview deployments.

In Supabase Dashboard -> Authentication -> Providers:

- Enable Email.
- Confirm email templates use Supabase's confirmation URL variables and do not hardcode `localhost`.

## Google auth settings

Google sign-in is hidden unless `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true`.

To enable it:

1. Supabase Dashboard -> Authentication -> Providers -> Google.
2. Enable Google.
3. Add the Google OAuth client ID and client secret.
4. In Google Cloud Console, add Supabase's Google callback URL from the Supabase Google provider screen as an authorised redirect URI.
5. Keep `/auth/callback` in Supabase Redirect URLs for the app redirect after Supabase completes OAuth.
6. Set `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true` and redeploy.

## Local email signup test

1. Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
2. Add `http://localhost:3000/auth/callback` to Supabase Redirect URLs.
3. Run the app locally.
4. Sign up with email.
5. Click the confirmation link. It should land on `/auth/callback`, exchange the code, and redirect to `/chat`.

## Beta email signup test

1. Set `NEXT_PUBLIC_SITE_URL=https://your-beta-domain.com` in the deployment environment.
2. Set the Supabase Site URL to the same deployed domain.
3. Add `https://your-beta-domain.com/auth/callback` to Supabase Redirect URLs.
4. Sign up on the deployed beta domain.
5. Click the confirmation link. It should land on the deployed `/auth/callback` route and redirect to `/chat`.
