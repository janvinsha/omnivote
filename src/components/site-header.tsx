import Link from "next/link"

import { siteConfig } from "@/config/site"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { ModeToggle } from "@/components/mode-toggle"
import { buttonVariants } from "./ui/button"
import { CommandMenu } from "./command-menu"
import { UserNav } from "./user-nav"
import Image from "next/image"
import { useEffect } from "react"
import { useWeb3Auth } from "@web3auth/modal-react-hooks"

export function SiteHeader() {
  const { theme } = useTheme()
  const { initModal, isConnected, web3Auth, connect, logout } = useWeb3Auth()
  const init = async () => {
    try {
      if (!isConnected && web3Auth) {
        await initModal();
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(
    () => {
      init()
    }, [isConnected, web3Auth]
  )
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none md:hidden flex">
            <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
              <Image src={theme === "light" ? "logo.svg" : "blackLogo.svg"} alt="logo" className="h-7 w-7" width={100} height={100} />
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