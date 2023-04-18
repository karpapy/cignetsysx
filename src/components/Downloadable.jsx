import { Button, Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'

export const Downloadable = ({ fileURL, filename, children }) => {
  const [showDownload, setShowDownload] = useState(false)

  return (
    <Flex
      width="fit-content"
      position="relative"
      borderRadius="10px"
      onMouseEnter={() => setShowDownload(true)}
      onMouseLeave={() => setShowDownload(false)}
    >
      {children}
      <Button
        colorScheme="blue"
        onClick={() => {
          const a = document.createElement('a')
          a.href = fileURL
          a.download = filename
          a.click()
        }}
        position="absolute"
        right="5"
        top="5"
        opacity={showDownload ? 1 : 0}
      >
        Download
      </Button>
    </Flex>
  )
}
