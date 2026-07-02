import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

const microsoftTenant = process.env.AZURE_AD_TENANT_ID || process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID || "common"
const microsoftIssuer =
  process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER || `https://login.microsoftonline.com/${microsoftTenant}/v2.0`

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AZURE_AD_CLIENT_ID || process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: microsoftIssuer,
      authorization: {
        params: {
          scope: "openid profile email offline_access User.Read Mail.Send",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})
