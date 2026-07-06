// App-only Microsoft Graph auth (client-credentials flow), used to read a specific
// mailbox's calendar (e.g. the firm-wide global calendar) independent of which
// portal user is signed in. Separate from the per-user delegated OAuth in auth.ts.

interface CachedToken {
  accessToken: string
  expiresAt: number
}

let cached: CachedToken | null = null

export class GraphAppAuthError extends Error {}

export async function getGraphAppToken(): Promise<string> {
  if (cached && cached.expiresAt > Date.now() + 30_000) {
    return cached.accessToken
  }

  // Deliberately separate from AZURE_AD_TENANT_ID, which drives delegated user sign-in
  // (kept multi-tenant/"common" so any Microsoft account can attempt login, gated by
  // matching against portalUsers.ts). App-only auth always needs one specific tenant —
  // the one Earl Carr's mailbox actually lives in.
  const tenantId = process.env.GRAPH_APP_TENANT_ID
  const clientId = process.env.AZURE_AD_CLIENT_ID || process.env.AUTH_MICROSOFT_ENTRA_ID_ID
  const clientSecret = process.env.AZURE_AD_CLIENT_SECRET || process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET

  if (!tenantId || tenantId === "common") {
    throw new GraphAppAuthError(
      "GRAPH_APP_TENANT_ID must be set to your organization's actual tenant ID (not \"common\") for app-only Graph access."
    )
  }
  if (!clientId || !clientSecret) {
    throw new GraphAppAuthError("AZURE_AD_CLIENT_ID / AZURE_AD_CLIENT_SECRET are not configured.")
  }

  const res = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://graph.microsoft.com/.default",
      grant_type: "client_credentials",
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new GraphAppAuthError(
      data.error_description || `Failed to acquire app-only Graph token (${res.status}). ` +
      "Ensure the app registration has an application permission (e.g. Calendars.Read) with admin consent granted."
    )
  }

  cached = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }
  return cached.accessToken
}
