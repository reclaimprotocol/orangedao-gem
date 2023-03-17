import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Heading, Image, Text, Link } from '@chakra-ui/react'
import QRCode from "react-qr-code";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected'
import axios from 'axios'
import { ConnectButton } from '@rainbow-me/rainbowkit';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL


function Home() {

    const { address } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    const [qrCodeValue, setQrCodeValue] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false)

    useEffect(() => {
        let details = navigator.userAgent;
        let regexp = /android|iphone|kindle|ipad/i;

        let isMobileDevice = regexp.test(details);

        if (isMobileDevice) {
            setIsMobileDevice(true)
        } else {
            setIsMobileDevice(false)
        }

    }, [])

    useEffect(() => {
        if (address) {
            axios.post(`${BASE_URL}/adduser`, { userAddress: address }).then((res) => {
                setQrCodeValue(res.data.templateUrl)
            }).catch((e) => {
                if (e.response.data.error.includes('ConditionalCheckFailedException')) {
                    setError('User already exists')
                } else {
                    console.error(e)
                }
            })
        }
    }, [address])

    useEffect(() => {
        if (error) {
            // alert(error)
            setError('')
            axios.get(`${BASE_URL}/user/${address}`).then((res) => {
                setQrCodeValue(res.data.templateLink.S)
            })
        }
    }, [error, address])


    return (
        <Box h='100vh' p={8}>
            <Flex h='70vh' direction='column' alignItems='center' justifyItems='center'>
                <Heading as='h1'>OrangeDao Gem</Heading>
                <Flex direction='column' alignItems='center' justifyItems='center'>

                    {
                        address ?
                            <>
                                <Text variant="subtext" fontWeight="700" mt={10} mb={4}>Connected wallet</Text>

                                {/* Account address */}
                                <Flex alignItems='center' gap={2}>
                                    <Box display='inline-flex' h="48px" alignItems="center" gap={2} backgroundColor="secondary" p={2} borderRadius="24px">
                                        <Image src='/assets/img/colorethereumIcon.svg' boxSize={8} alt="" />
                                        <Text color="#FB870F" fontSize="16px" fontWeight={700} pr={4}>{address}</Text>
                                    </Box>
                                    <Text variant="subtext" fontWeight={700} color="red" onClick={() => disconnect()} cursor="pointer">Disconnect</Text>
                                </Flex>

                                {/* QR Code */}

                                {
                                    !isMobileDevice &&
                                         <>
                                            {
                                                qrCodeValue && <><Heading as='h1' mt={10}>Scan the QR</Heading>
                                                    <Text variant="subtext" mt={8} mb={8}>Use your bookface credentials in Reclaim wallet to prove you&apos;re a YC alum.</Text>
                                                    <QRCode
                                                        value={qrCodeValue}
                                                    />
                                                    <Text mt={10} color="gray" fontWeight={500}>Don&apos;t have the Reclaim wallet?</Text>
                                                </>
                                            }
                                        </>
                                }
                                
                                <Button variant="primary"
                                    onClick={() => {
                                        if (isMobileDevice)
                                            window.open(qrCodeValue, '_blank')
                                    }} p={4} mt={isMobileDevice ? 8 : 2} h="56px" w="230px">{isMobileDevice ? "Open Reclaim wallet" : "Download Reclaim wallet"}</Button>
                            </>
                            : <Flex direction='column' alignItems='center' gap={8} justifyItems='center'>
                                <Image src='/assets/img/heroimage.png' width='350px' height='341px' alt="" />
                                <Heading as='h2'>Let&apos;s mint your Orange Gem!</Heading>
                                <Text variant="subtext">Your Orange DAO community access token.</Text>

                                <ConnectButton />
                            </Flex>
                    }
                </Flex>
            </Flex>
        </Box>

    )
}

// const renderMobileView = ({ url }: { url: string }) => {
//     return (
//         <Text mt={10}>
//             <Link textDecoration={"underline"} color='black.700' href={url} isExternal>
//                 Tap here to open on reclaim App
//             </Link>
//         </Text>

//     )
// }

export default Home