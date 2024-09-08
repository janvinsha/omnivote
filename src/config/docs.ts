import { MainNavItem, SidebarNavItem } from "@/types/nav"


export interface DocsConfig {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Proposal",
      href: "/proposal",
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
