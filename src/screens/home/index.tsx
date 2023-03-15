import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Heading, Image, Text } from '@chakra-ui/react'
import QRCode from "react-qr-code";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected'
import axios from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

function Home() {

    const { address } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    const [qrCodeValue, setQrCodeValue] = useState<string>('')

    useEffect(() => {
        if (address) {
            axios.post(`${BASE_URL}/adduser`, { userAddress: address }).then((res) => {
                setQrCodeValue(res.data.templateUrl)
            })
        }
    }, [address])


    return (
        <Box h='100vh' p={8}>
            <Flex h='70vh' direction='column' alignItems='center' justifyItems='center'>
                <Heading as='h1'>OrangeDao Gem</Heading>
                <Flex direction='column' alignItems='center' gap={8} justifyItems='center'>

                    {
                        address ?
                            <>
                                <Text variant="subtext" fontWeight="700">Connected wallet</Text>

                                {/* Account address */}
                                <Flex alignItems='center' gap={2}>
                                    <Box display='inline-flex' h="48px" alignItems="center" gap={2} backgroundColor="secondary" p={2} borderRadius="24px">
                                        <Image src='/assets/img/colorethereumIcon.svg' boxSize={8} alt="" />
                                        <Text color="#FB870F" fontSize="16px" fontWeight={700}>{address}</Text>
                                    </Box>
                                    <Text variant="subtext" fontWeight={700} color="red" onClick={() => disconnect()} cursor="pointer">Disconnect</Text>
                                </Flex>

                                {/* QR Code */}
                                <Heading as='h1'>Scan the QR</Heading>
                                <Text variant="subtext">Use your bookface credentials to prove you’re a YC alum.</Text>
                                <QRCode
                                    value={qrCodeValue}
                                />
                                <Button variant="primary" onClick={() => { }} p={4} h="56px" w="230px">Download Reclaim App</Button>
                            </>
                            : <>
                                <Image src='/assets/img/heroimage.png' width='350px' height='341px' alt="" />
                                <Heading as='h2'>Let&apos;s mint your Orange Gem!</Heading>
                                <Text variant="subtext">Your Orange DAO community access token.</Text>

                                {/* Connect wallet CTA */}
                                <Button variant="primary" onClick={() => connect()}>Connect wallet </Button>
                            </>
                    }
                </Flex>
            </Flex>
        </Box>

    )
}

export default Home