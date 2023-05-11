const { Flex, Button } = require('@chakra-ui/react')

export const Logger = () => {
  const handleClick = async () => {
    const result = await fetch('/api/get-counts')
    const data = await result.json()
  }

  return (
    <Flex w="100%" justify={'center'} align={'center'}>
      <Button fontSize="2xl" m={5} colorScheme="orange" onClick={handleClick}>
        Log
      </Button>
    </Flex>
  )
}
