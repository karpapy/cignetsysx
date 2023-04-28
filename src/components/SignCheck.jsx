import { Badge, Box } from '@chakra-ui/react'
import { verifyMessage } from 'ethers/lib/utils'

export const SignCheker = ({ message, address, sign }) => {
  console.log('sign', sign)
  if (!address) return null
  if (!message) return null
  if (!sign) return <Badge colorScheme="red">Requires signature</Badge>
  const verified = verifyMessage(message, sign)
  return (
    <Badge colorScheme={verified === address ? 'green' : 'red'}>
      {verified === address ? 'signature Verified' : 'Requires signature'}
    </Badge>
  )
}
