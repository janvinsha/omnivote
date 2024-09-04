import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Web3AuthProvider, Web3AuthInnerContext, useWeb3Auth } from "@web3auth/modal-react-hooks";
import { web3AuthContextConfig } from "../lib/web3AuthProviderProps";
import { Provider } from 'jotai'
import { Toaster } from "@/components/ui/toaster"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Web3AuthProvider config={web3AuthContextConfig}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          <Component {...pageProps} />
          <Toaster />
          <SiteFooter />
        </ThemeProvider>
      </Web3AuthProvider >
    </Provider>
  );
}
