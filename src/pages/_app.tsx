import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@/theme';
import { WagmiConfig, createClient, configureChains } from 'wagmi'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains([goerli], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains
});

const client = createClient({
  autoConnect: true,
  provider,
  connectors
})

export default function App({ Component, pageProps }: AppProps) {

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains} theme={darkTheme(
        {
          accentColor: 'linear-gradient(90deg, #FB870D 0%, #EA7826 100%)',
          borderRadius: 'large',
        }
      )}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>

  )
}
