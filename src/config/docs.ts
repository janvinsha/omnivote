import { MainNavItem, SidebarNavItem } from "@/types/nav"


export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Proposals",
      href: "/proposals",
    },
    {
      title: "Dao",
      href: "/dao",
    },
    {
      title: "Attestation",
      href: "/attestation",
    },
    // {
    //   title: "Create",
    //   href: "/create",
    // },
  ],
  sidebarNav: [

  ],
}
