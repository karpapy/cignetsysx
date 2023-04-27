import {
  Box,
  Button,
  CloseButton,
  Container,
  Icon,
  Square,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react'

import { useState } from 'react'

export const Annoucement = () => {
  const [show, setShow] = useState(true)

  if (!show) return null
  return (
    <Box bg="white" padding={2} textAlign="center" color="black" shadow="lg">
      YOU CAN CUSTOMIZE THE CIG NOW GUYS LIKE IF YOU CLICK CUSTOMIZE
      <Button mx={6} onClick={() => setShow(false)}>
        X
      </Button>
    </Box>
  )
}
