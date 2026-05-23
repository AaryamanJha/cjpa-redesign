"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

type Theme = "dark" | "light"

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem("cjpa_theme", theme)
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const stored = localStorage.getItem("cjpa_theme") as Theme | null
    const nextTheme = stored === "light" || stored === "dark" ? stored : "dark"
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }, [])

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  const isLight = theme === "light"
  const Icon = isLight ? Moon : Sun

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Dark mode" : "Light mode"}
      className={[
        "theme-toggle inline-flex items-center justify-center border transition-colors",
        compact ? "h-8 w-8" : "h-10 w-10",
      ].join(" ")}
    >
      <Icon size={compact ? 14 : 15} strokeWidth={1.5} />
    </button>
  )
}
