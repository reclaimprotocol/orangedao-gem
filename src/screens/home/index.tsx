import React, { useEffect, useState } from 'react'
import { Box, Button, Flex, Heading, Image, Text, Link } from '@chakra-ui/react'
import QRCode from "react-qr-code";
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected'
import axios from 'axios'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { truncateAddress } from '@/utils/utils';
import { status } from '@/utils/constants';
import {useRouter} from 'next/router'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL


function Home() {

    const { address } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    const [qrCodeValue, setQrCodeValue] = useState<string>('')
    const [claimStatus, setClaimStatus] = useState<string>('')
    const [userId, setUserId] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false)

    const router = useRouter()
    console.log('router', router.query)

    const handleCallback = async () => {
        const payload = {
            claims: [{
                id: 2,
                provider: 'yc-login',
                redactedParameters: '****@gmail.com',
                ownerPublicKey: '0x6536tgdejwvd',
                timestampS: '9763p971',
                witnessAddresses: ['wintnessaddress1'],
                signatures: ['signature1'],
                parameters: {
                    userId: '123456',
                }
            }]
        }
        const response = await fetch('http://localhost:3000/callback/0x4d7F2f4BAE824Ff50fbc44e2a573D462619fC518',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })
        console.log('response', response)
    }

    const fetchUserClaimDetails = (address: string) => {
        axios.get(`${BASE_URL}/user/${address}`).then((res) => {
            console.log('res', res)
            setClaimStatus(res.data.claimStatus.S)
            setQrCodeValue(res.data.templateLink.S)
            if(res.data.claimStatus.S === status.CLAIMED && res.data.userId) {
                setUserId(res.data.userId.S)
            }
        })
    }

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
        if (router.query && router.query.callbackId) {
            fetchUserClaimDetails(router.query.callbackId as string)
        }
    }, [router.query])

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
            fetchUserClaimDetails(address as string)
        }
    }, [error, address])


    return (
        <Box h='100vh' p={8}>
            <Flex h='70vh' direction='column' alignItems='center' justifyItems='center'>
                <Flex alignItems="center" gap={4}>
                    <Image src='assets/img/orangelogo.svg' alt='logo' boxSize={20} />
                    <Heading as='h1'>Orange Dao</Heading>
                </Flex>

                <Flex direction='column' alignItems='center' justifyItems='center'>

                    {
                        address || userId ?
                            <>
                                <Text variant="subtext" fontWeight="700" mt={10} mb={4} display={userId ? 'none' : ''}>Connected wallet</Text>

                                {/* Account address */}
                                <Flex alignItems='center' gap={2}>
                                    <Box h="48px" alignItems="center" gap={2} backgroundColor="secondary" p={2} borderRadius="24px" display={userId ? 'none' : 'inline-flex'}>
                                        <Image src='/assets/img/colorethereumIcon.svg' boxSize={8} alt="" />
                                        <Text color="#FB870F" fontSize={{ base: '12px', md: '14px', lg: '16px' }} fontWeight={700} pr={4} display={userId ? 'none' : ''}>{isMobileDevice ? truncateAddress(address!) : address}</Text>
                                    </Box>
                                    <Text variant="subtext" fontSize={{ base: '12px', md: '14px', lg: '16px' }} fontWeight={700} color="red" onClick={() => disconnect()} cursor="pointer" display={userId ? 'none' : ''}>Disconnect</Text>
                                </Flex>

                                {/* QR Code */}

                                
                                {
                                    (claimStatus === status.CLAIMED && userId) ? renderUserIdClaimed({userId}) : 
                                        (!isMobileDevice) &&
                                        <>
                                            {
                                                qrCodeValue && renderQRCode({ qrCodeValue })
                                            }
                                        </>
                                    
                                }

                                <Button variant="primary"
                                    isDisabled={isMobileDevice ? !qrCodeValue : false}
                                    onClick={() => {
                                        if (isMobileDevice)
                                            window.open(qrCodeValue, '_blank')
                                    }} p={4} mt={isMobileDevice ? 8 : 2} h="56px" w="230px">{(isMobileDevice) ? "Open Reclaim wallet" : "Download Reclaim wallet"}</Button>
                            </>
                            : <Flex direction='column' alignItems='center' gap={8} justifyItems='center'>
                                <Image src='/assets/img/heroimage.png' mt={8} width={isMobileDevice ? '250px' : '350px'} height={isMobileDevice ? '250px' : '341px'} alt="" />
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

const renderQRCode = ({qrCodeValue}: {qrCodeValue: string}) => {
    return (
        <><Heading as='h1' mt={10}>Scan the QR</Heading>
            <Text variant="subtext" mt={8} mb={8}>Use your bookface credentials in Reclaim wallet to prove you&apos;re a YC alum.</Text>
            <QRCode
                value={qrCodeValue}
            />
            <Text mt={10} color="gray" fontWeight={500}>Don&apos;t have the Reclaim wallet?</Text>
        </>
    )
}

const renderUserIdClaimed = ({userId}: {userId: string}) => {
    return (
        <Text  mt={10} mb={4} color="gray" fontWeight={700}>You&apos;ve already claimed your Orange Gem for user id {userId}! 🎉</Text>
    )
}

export default Home