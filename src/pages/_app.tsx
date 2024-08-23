import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react";
import { ApplicationProvider } from '@/context/ApplicationContext';
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";



export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}
      refetchInterval={24 * 60 * 60}
    >
      <ApplicationProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <Component {...pageProps} />
          <SiteFooter />
        </ThemeProvider>
      </ApplicationProvider>
    </SessionProvider>

  );
}

