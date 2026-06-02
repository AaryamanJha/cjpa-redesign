// Microsoft Entra ID OAuth via NextAuth v5
// Requires: AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID, AUTH_SECRET in .env.local
import { handlers } from "@/auth"

export const { GET, POST } = handlers
