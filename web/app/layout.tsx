import type { Metadata } from "next"
import { Cormorant_Garamond, Playfair_Display, Space_Grotesk } from "next/font/google"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "CJPA Global Advisors",
  description:
    "Strategic advisory at the intersection of capital strategy, geopolitical intelligence, and cross-border policy.",
  keywords: ["global advisory", "geopolitical intelligence", "capital strategy", "cross-border consulting"],
  openGraph: {
    title: "CJPA Global Advisors",
    description: "Strategic advisory for a complex world.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${playfair.variable} ${spaceGrotesk.variable} h-full`}
      data-theme="dark"
    >
      <body className="min-h-full bg-[#070B14] flex flex-col">
        {children}
      </body>
    </html>
  )
}
