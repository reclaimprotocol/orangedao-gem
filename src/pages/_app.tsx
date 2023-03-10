import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppContextProvider } from '@/Contexts/Context'
import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </ChakraProvider>

  )
}
