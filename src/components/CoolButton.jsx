import { Button, Flex, Text } from '@chakra-ui/react'

export const CoolButton = ({ children, onClick }) => {
  return (
    <Flex align={'center'} justify={'center'}>
      <Text mx="3px">[</Text>
      <Button onClick={onClick} variant="unstyled" _hover={{ color: 'blue' }}>
        {children}
      </Button>
      <Text mx="3px">]</Text>
    </Flex>
  )
}
