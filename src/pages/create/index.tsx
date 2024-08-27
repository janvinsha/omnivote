import { useEffect } from "react"
import { CreateForm } from "@/components/create-form"
import { Separator } from "@/components/ui/separator"
import { SidebarNav } from "@/components/sidebar-nav"

const sidebarNavItems = [
    {
        title: "Profile",
        href: "/examples/forms",
    },
    {
        title: "Account",
        href: "/examples/forms/account",
    },
    {
        title: "Appearance",
        href: "/examples/forms/appearance",
    },
    {
        title: "Notifications",
        href: "/examples/forms/notifications",
    },
    {
        title: "Display",
        href: "/examples/forms/display",
    },
]
export default function CreatePage() {
    return (<div className="container relative">
        <div className="hidden space-y-6 p-5 px-10 pb-16 md:block">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight"> Create a DAO (Decentralized Autonomous Organization)</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and set e-mail preferences.
                </p>
            </div>
            <Separator className="my-6" />
        </div>


        <div className="flex  space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 px-10 justify-center">
            {/* <aside className="mx-4 lg:w-1/5">
                <SidebarNav items={sidebarNavItems} />
            </aside> */}
            <div className="flex-1 lg:max-w-2xl">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium"> DAO</h3>
                        <p className="text-sm text-muted-foreground">
                            This is how others will see your DAO.
                        </p>
                    </div>
                    {/* <Separator /> */}
                    <CreateForm />
                </div>
            </div>
        </div>

    </div>
    )
}
