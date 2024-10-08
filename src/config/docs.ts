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
      title: "Daos",
      href: "/daos",
    },
    {
      title: "Votes",
      href: "/votes",
    },
    // {
    //   title: "Create",
    //   href: "/create",
    // },
  ],
  sidebarNav: [

  ],
}
