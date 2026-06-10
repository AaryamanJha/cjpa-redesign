# CJPA Domain Deployment

Deploy the `web` folder as the production Next.js app.

## Vercel Project

1. Import this repository into Vercel.
2. Set the project root directory to `web`.
3. Use:
   - Framework: `Next.js`
   - Install command: `npm ci`
   - Build command: `npm run build`
4. Add the production domain:
   - Primary: `www.cjpa.us`
   - Redirect/apex: `cjpa.us`

## Production Environment Variables

Set these in Vercel Project Settings > Environment Variables:

```env
GROQ_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
AZURE_AD_CLIENT_ID=
AZURE_AD_CLIENT_SECRET=
AZURE_AD_TENANT_ID=common
AUTH_SECRET=
AUTH_URL=https://www.cjpa.us
```

Generate `AUTH_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## DNS

The domain currently points to Squarespace. To move it to Vercel, replace the existing Squarespace records with Vercel records:

```text
Type   Name   Value
A      @      76.76.21.21
CNAME  www    cname.vercel-dns.com
```

Remove the current Squarespace apex A records:

```text
198.185.159.144
198.185.159.145
198.49.23.144
198.49.23.145
```

Remove the current `www` CNAME to `ext-sq.squarespace.com`.

## Microsoft Login / Outlook

In the Azure App Registration, add this production redirect URI:

```text
https://www.cjpa.us/api/auth/callback/microsoft-entra-id
```

Keep the local redirect URI for development:

```text
http://localhost:3000/api/auth/callback/microsoft-entra-id
```

The app also needs Microsoft Graph delegated permissions:

```text
User.Read
Mail.Send
```

Microsoft sign-in maps the signed-in email to `data/teamMembers.ts`, so every real portal user needs their Microsoft email listed there before Microsoft login will admit them.
