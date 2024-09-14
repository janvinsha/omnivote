"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "./icons"
import Image from "next/image"
import { useTheme } from "next-themes"

export function MainNav() {
  const pathname = usePathname()
  const { theme } = useTheme()
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Image src={theme === "dark" ? "blackLogo.svg" : "logo.svg"} alt="logo" className="h-7 w-7" width={100} height={100} />
        <span className="hidden text-lg font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-4 text-md lg:gap-6">
        <Link
          href="/proposals"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/proposals" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Proposals
        </Link>
        <Link
          href="/daos"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/daos" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Daos
        </Link>
        <Link
          href="/votes"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/votes" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Vote
        </Link>
        {/* <Link
          href="/create"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/create" ? "text-foreground" : "text-foreground/60"
          )}
        >
          Create
        </Link> */}

      </nav>
    </div>
  )
}
