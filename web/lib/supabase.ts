import { createClient } from "@supabase/supabase-js"

// Server-side admin client — uses service role key, never exposed to the browser
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ─── database row types ────────────────────────────────────────────────────────

export interface DbUser {
  id: string
  microsoft_id: string | null
  email: string
  name: string
  title: string | null
  role: string
  permissions: string[]
  is_portal_admin: boolean
  created_at: string
}

export interface DbInvitation {
  id: string
  email: string
  role: string
  token_hash: string
  invited_by: string | null
  status: "pending" | "accepted" | "expired" | "revoked"
  expires_at: string
  accepted_at: string | null
  created_at: string
  // joined from users table
  invited_by_name?: string
}
