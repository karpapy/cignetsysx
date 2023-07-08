import Head from 'next/head'
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Flex,
  VStack,
  Badge,
} from '@chakra-ui/react'
import { RenderComponent } from '@/components/Render'
import { Annoucement } from '@/components/Announcement'
import React, { useEffect, useState } from 'react'
import {
  banWord,
  getBannedWords,
  checkPass,
  removeBannedWord,
} from '@/lib/words'
import { loadCloudflareCache } from '@/lib/loader'

export default function Admin() {
  const [bannedWords, setBannedWords] = useState([])
  const [word, setWord] = useState('')

  const [show, setShow] = useState(false)

  useEffect(() => {
    const response = prompt('Enter password (you may need to do it twice)')
    if (typeof response !== 'string') return
    if (checkPass(response, 'c21va2VHMDBkQ2hhZ2dh')) {
      setShow(true)
      loadCloudflareCache()
    } else {
      alert('Incorrect password')
      window.location.reload()
    }
  }, [])

  useEffect(() => {
    const words = async () => {
      try {
        const words = await getBannedWords()
        setBannedWords(words)
      } catch (err) {
        console.log(err)
      }
    }
    words()
  }, [])

  const handleAddWord = async () => {
    banWord(word)
    setWord('')
    window.location.reload()
  }

  const handleUnbanWord = async (word) => {
    removeBannedWord(word)
    window.location.reload()
  }

  return (
    <>
      <Head>
        <title>Cigbot render online admin area</title>
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
        w="95vw"
      >
        <Heading as="h1" size="2xl" my={4}>
          Cigbot render online admin area
        </Heading>
        <Text fontSize="xl" mb={4}>
          This is the admin area for cigbot render online
        </Text>
        {show && (
          <VStack align="left">
            <Text>Banned words: (turn the label text red)</Text>
            {bannedWords.map((word, index) => {
              return (
                <Flex key={index} justifyContent="space-between">
                  <Text fontWeight="bold" bgColor="gray.100" flexGrow={1} p={2}>
                    {word.word}
                  </Text>
                  <Button
                    colorScheme="red"
                    onClick={() => handleUnbanWord(word.word)}
                  >
                    unban
                  </Button>
                </Flex>
              )
            })}
            <Flex>
              <Input
                placeholder="Type word here..."
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
            </Flex>
            <Button
              onClick={handleAddWord}
              variant="solid"
              backgroundColor="orange.400"
              color="white"
            >
              Add banned word
            </Button>
          </VStack>
        )}
        {!show && <Heading>waiting for password...</Heading>}
      </Box>
    </>
  )
}
