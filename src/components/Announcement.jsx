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
  Stack,
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

    setAnnoucement(data['announcement'])
    if (data['author']) {
      if (data['author'][0] === '@') {
        setAuthor(data['author'].slice(1))
      }
    }
    setAuthor(data['author'])
  }

  useEffect(() => {
    getAnounceData()
    if (setRefresh) setRefresh(false)
  }, [refresh, setRefresh])

  if (!show) return null
  return (
    <Box bg="white" paddingX={2} color="black" shadow="lg">
      <Skeleton isLoaded={annoucement !== null}>
        <Flex alignItems="center" justifyContent="center" py={1}>
          <Box flexGrow={1}>
            <Text fontSize="lg" textAlign="center">
              {annoucement}
            </Text>
            <Text textAlign="center" fontSize="12px" py={1} ml="10ch">
              {author !== '' && ' — '}
              <Link color="blue" href={'https://twitter.com/' + author}>
                {author}
              </Link>{' '}
            </Text>
          </Box>
          <Stack ml={2}>
            <Button
              variant="ghost"
              colorScheme="red"
              my={0}
              size="sm"
              w="100%"
              onClick={() => setShow(false)}
            >
              close
            </Button>
            <Text fontSize="12px">
              [
              <Link
                fontSize="12px"
                textAlign="center"
                color="blue"
                href="/announce"
              >
                create an announcement
              </Link>
              ]
            </Text>
          </Stack>
        </Flex>
      </Skeleton>
    </Box>
  )
}
