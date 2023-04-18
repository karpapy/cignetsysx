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
    <Box bg="white" padding={2} textAlign="center" color="black" shadow="xl">
      NEW!! PAPPACHAGA funeral edition!! Now you can render whilst mourning!!
      <Button colorScheme="orange" mx={2} onClick={() => setShow(false)}>
        close
      </Button>
    </Box>
  )
}
