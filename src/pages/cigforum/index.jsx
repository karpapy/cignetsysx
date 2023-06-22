import Head from 'next/head'
import { Inter } from 'next/font/google'
import {
  Box,
  Button,
  Input,
  Heading,
  Text,
  Textarea,
  Flex,
} from '@chakra-ui/react'
import { RenderComponent } from '@/components/Render'
import { Annoucement } from '@/components/Announcement'
import { PostList } from '@/components/PostList'
import React from 'react'
import { Logger } from '@/components/Logger'
import party from 'party-js'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  usePrepareSendTransaction,
  useSignMessage,
} from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { createClient } from '@supabase/supabase-js'
import { useState, useEffect, useRef } from 'react'
import { SignCheker } from '@/components/SignCheck'
import { Footer } from '@/components/Footer'
import Link from 'next/link'
import { CoolButton } from '@/components/CoolButton'

const getPreviousPosts = async () => {
  const result = await fetch('/api/cigforum/get-posts')
  const { posts } = await result.json()
  return posts
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_ROLE,
)

export default function Home() {
  const [textToRender, setTextToRender] = React.useState('')
  const [messageSigned, setMessageSigned] = useState('')
  const [message, setMessage] = useState('')
  const [renderedText, setRenderedText] = React.useState('')
  const [previousPosts, setPreviousPosts] = useState([])

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { disconnect } = useDisconnect()
  useEffect(() => {
    setClientIsConnected(isConnected)
  }, [isConnected])
  const [showSpinner, setShowSpinner] = useState(false)

  const inputRef = React.useRef(null)
  const buttonRef = React.useRef(null)
  const signMessage = useSignMessage({
    message,
    onSuccess(data) {
      setMessageSigned(data)
    },
  })
  const handleSignMessage = async () => {
    const data = await signMessage.signMessage()
    setMessageSigned(data)
  }

  useEffect(() => {
    buttonRef.current.addEventListener('click', () => {
      party.confetti(buttonRef.current)
    })
  }, [])

  useEffect(() => {
    getPreviousPosts().then((data) => {
      setPreviousPosts(data)
    })
  }, [])

  const [clientIsConnected, setClientIsConnected] = useState(false)

  const doCigpost = async (message, messageSigned, address) => {
    const result = await fetch('/api/cigforum/cigpost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        messageSigned,
        address,
      }),
    })
    const data = await result.json()
    const newPosts = await getPreviousPosts()
    setPreviousPosts(newPosts)
  }

  return (
    <>
      <Head>
        <title>cignet forum</title>
        <meta
          name="description"
          content="Generate custom cigs online free now"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Annoucement />
      <Box
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        w="100%"
      >
        <Box display="flex" alignItems="center" flexDir="column" w="100%">
          <Flex
            fontSize="lg"
            margin="20px"
            fontFamily="monospace"
            justifyContent="center"
            alignItems="center"
          >
            <CoolButton>
              <Link href="/cigforum">cigforum</Link>
            </CoolButton>
          </Flex>
          <Text>top level threads</Text>
        </Box>

        <Box w="100%">
          <PostList wrap={true} posts={previousPosts} />
          <Input
            my={2}
            placeholder="text to cigpost..."
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                doCigpost(message)
                party.confetti(buttonRef.current)
              }
            }}
            ref={inputRef}
          />
          <SignCheker
            message={message}
            address={address}
            sign={messageSigned}
          />

          <Box display="flex">
            <Button onClick={connect} my={2} colorScheme="orange" w="100%">
              {clientIsConnected
                ? address.slice(0, 6) + '...' + address.slice(-4)
                : 'CONNECT WALLET'}
            </Button>
            {clientIsConnected && (
              <Button ml={3} onClick={handleSignMessage} my={2} w="100%">
                Sign Message
              </Button>
            )}
          </Box>
          <Button
            colorScheme="orange"
            size="lg"
            my={2}
            ref={buttonRef}
            onClick={() => {
              doCigpost(message, messageSigned, address)
            }}
            w={'100%'}
          >
            cigpost
          </Button>
        </Box>
      </Box>
      <Footer />
    </>
  )
}
