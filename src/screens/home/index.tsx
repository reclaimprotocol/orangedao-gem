import React, { useContext, useState } from 'react'
import { AppContextType } from '../../utils/types'
import { AppContext } from '../../Contexts/Context'
import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import QRCode from "react-qr-code";

function Home() {
    const { account, connectWallet, state } = useContext(AppContext) as AppContextType

    const [qrCodeValue, setQrCodeValue] = useState<string>('')

    return (
        <Box h='100vh'>
            <Flex direction='column' alignItems='center' justifyItems='center'>
                <Heading as='h1'>OrangeDao Gem</Heading>
                {
                    account ? 
                    <>
                        <h2>{account}</h2>
                        <QRCode
                        value='credwallet://'
                        />
                    </> 
                    : <Button colorScheme='orange' onClick={connectWallet}>Connect wallet</Button>
                }

            </Flex>
        </Box>

    )
}

export default Home