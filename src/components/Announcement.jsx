import {
  Box,
  Button,
  CloseButton,
  Container,
  Icon,
  Square,
  Flex,
  Text,
  Link,
  useBreakpointValue,
  Skeleton,
} from '@chakra-ui/react'
import { createClient } from '@supabase/supabase-js'

import { useEffect, useState } from 'react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_ROLE,
)

export const Annoucement = ({ refresh, setRefresh }) => {
  const [show, setShow] = useState(true)
  const [annoucement, setAnnoucement] = useState(null)
  const [author, setAuthor] = useState(null)

  async function getAnounceData() {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single()

    console.log(data)
    setAnnoucement(data['announcement'])
    if (data['author']) {
      if (data['author'][0] === '@') {
        setAuthor(data['author'].slice(1))
      }
    }
    setAuthor(data['author'])
  }

  useEffect(() => {
    console.log('refreshing')
    getAnounceData()
    if (setRefresh) setRefresh(false)
  }, [refresh, setRefresh])

  if (!show) return null
  return (
    <Box bg="white" paddingX={2} color="black" shadow="lg">
      <Skeleton isLoaded={annoucement !== null}>
        <Flex alignItems="center" justifyContent="center" py={1}>
          <Text fontSize="lg" flexGrow={1} textAlign="center">
            {annoucement}
          </Text>
          <Button
            variant="ghost"
            colorScheme="red"
            mx={6}
            size="md"
            onClick={() => setShow(false)}
          >
            close
          </Button>
        </Flex>
        <Text textAlign="center" fontSize="12px" pb={1}>
          -{' '}
          <Link color="blue" href={'https://twitter.com/' + author}>
            {author}
          </Link>{' '}
          (
          <Link color="blue" href="/announce">
            create new announcement
          </Link>
          )
        </Text>
      </Skeleton>
    </Box>
  )
}
