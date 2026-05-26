# Supabase Setup

The portal can sync shared prototype data through Supabase when these environment variables are set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Steps

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run `web/supabase/schema.sql`.
4. Copy the project URL and anon/publishable key into `.env.local`.
5. Restart `npm run dev`.
6. Deploy the same env vars in Vercel.

The app still falls back to browser `localStorage` if Supabase is not configured or the table is missing.

## Important Security Note

This keeps the existing mock CJPA ID login and allows anon-key reads/writes for prototype sync. Do not store sensitive credentials, passwords, private deal documents, or confidential data in synced portal records until the portal uses real Supabase Auth and stricter RLS policies.

