import {
  Box,
  Image,
  Text,
  Image as ChakraImage,
  Skeleton,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { getImageBufferData } from '@/lib/createImage'
import { Downloadable } from './Downloadable'

export const Pack = ({ cignum, message }) => {
  const [loading, setLoading] = useState(true)
  const [dataURI, setDataURI] = useState('')

  const render = async (cignum, message) => {
    setLoading(true)
    let cignumber = cignum
    const bdata = await getImageBufferData(message, cignumber)
    let dataURI = bdata['data']
    setDataURI(dataURI)
    setLoading(false)
  }

  useEffect(() => {
    render(cignum, message)
  }, [cignum, message])

  return (
    <Box>
      <Skeleton
        isLoaded={!loading}
        width={['400px', '500px']}
        {...(loading && {
          height: '625px',
          width: '400px',
          borderRadius: '6px',
          marginY: '7px',
        })}
      >
        <Downloadable fileURL={dataURI} filename="render.png">
          <ChakraImage
            borderRadius="6px"
            marginY="7px"
            src={dataURI}
            alt="A cig"
            width="100%"
          />
        </Downloadable>
      </Skeleton>
    </Box>
  )
}
