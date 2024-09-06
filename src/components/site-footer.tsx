import { siteConfig } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="py-6 md:px-12 md:py-0 px-0 w-full">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row w-full">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left w-full">
          Built by{" "}
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Vincent
          </a>
          . The source code is available on{" "}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
