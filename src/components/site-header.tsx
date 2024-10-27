import Link from "next/link"

import { siteConfig } from "@/config/site"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

// import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"

import { UserNav } from "./user-nav"

export function SiteHeader() {
  const { theme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="md:container flex h-16 md:h-20 px-6 md:max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none md:hidden flex">
            <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
              <img src={theme === "light" ? "logo.svg" : "blackLogo.svg"} alt="logo" className="h-7 w-7" width={100} height={100} />
              <span className="font-bold inline-block">
                {siteConfig.name}
              </span>
            </Link>
          </div>
          <nav className="flex space-x-4 items-center">
            <ModeToggle />
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  )
}
