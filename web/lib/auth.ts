// PROTOTYPE ONLY
// Production Auth.js / Microsoft Entra ID integration is intentionally disabled.
// The current portal uses mock CJPA IDs, local state, and localStorage.

export const auth = async () => null

export const handlers = {
  GET: async () => Response.json({ error: "Production auth is disabled in this prototype." }, { status: 501 }),
  POST: async () => Response.json({ error: "Production auth is disabled in this prototype." }, { status: 501 }),
}

export const signIn = async () => {
  throw new Error("Production auth is disabled in this prototype. Use /login with a mock CJPA ID.")
}

export const signOut = async () => {
  throw new Error("Production auth is disabled in this prototype. Use PortalContext.logout().")
}
