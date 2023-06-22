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
import { useRouter } from 'next/router'
import { CoolButton } from '@/components/CoolButton'
import Link from 'next/link'
import { Pack } from '@/components/Pack'

const getPreviousPost = async (id) => {
  if (!id) return
  const result = await fetch('/api/cigforum/get-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
    }),
  })

  const { post } = await result.json()
  return post
}

const getReplies = async (id) => {
  if (!id) return
  const result = await fetch('/api/cigforum/get-replies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
    }),
  })

  const { posts } = await result.json()
  return posts
}

export default function Home() {
  const router = useRouter()
  const { id } = router.query

  const [messageSigned, setMessageSigned] = useState('')
  const [message, setMessage] = useState('')
  const [previousPost, setPreviousPost] = useState({})
  const [replies, setReplies] = useState([])

  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  useEffect(() => {
    setClientIsConnected(isConnected)
  }, [isConnected])

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
    getPreviousPost(id).then((data) => {
      setPreviousPost(data)
      getReplies(id).then((data) => {
        setReplies(data)
      })
    })
  }, [id])

  const [clientIsConnected, setClientIsConnected] = useState(false)

  const doCigreply = async (message, messageSigned, address) => {
    await fetch('/api/cigforum/reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        messageSigned,
        address,
        id,
      }),
    })
    const newPosts = await getPreviousPost()
    setPreviousPost(newPosts)
    window.location.reload()
  }

  return (
    <>
      <Head>
        <title>cigforum/{id}</title>
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
            <Text>/</Text>
            <CoolButton>
              <Link href="/cigforum">cigforum</Link>
            </CoolButton>
            <Text>/</Text>
            <Text>p</Text>
            <Text>/</Text>
            <Text>{id}</Text>
          </Flex>
        </Box>

        <Box bgColor="red.200" p={1}>
          {previousPost && (
            <>
              {previousPost.parent_id && (
                <CoolButton>
                  <Link href={`/cigforum/p/${previousPost.parent_id}`}>
                    view parent (post {previousPost.parent_id})
                  </Link>
                </CoolButton>
              )}
              <Pack
                cignum={previousPost.cignum}
                message={previousPost.message}
              />
            </>
          )}
        </Box>
        {replies && <PostList wrap={false} posts={replies} />}
        <Box mx={1}>
          <Input
            w="100%"
            my={2}
            placeholder="text to cigreply..."
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
              doCigreply(message, messageSigned, address)
            }}
            w="100%"
          >
            cigreply
          </Button>
        </Box>
      </Box>
      <Footer />
    </>
  )
}
