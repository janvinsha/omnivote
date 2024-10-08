import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Web3AuthProvider, Web3AuthInnerContext, useWeb3Auth } from "@web3auth/modal-react-hooks";
import { web3AuthContextConfig } from "../lib/web3AuthProviderProps";
import { Provider } from 'jotai'
import { Toaster } from "@/components/ui/toaster"
import { config } from "@/config/wagmiConfig";

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
  return (
    <Provider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </WagmiProvider>
    </Provider >
  );
}
