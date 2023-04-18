import { getImageBufferData } from '@/lib/createImage'
import {
  Box,
  Text,
  Button,
  Image as ChakraImage,
  Input,
  chakra,
  Link,
  Stack,
  Flex,
  Checkbox,
} from '@chakra-ui/react'
import { useState, useRef, useEffect } from 'react'
import { Downloadable } from './Downloadable'
import party from 'party-js'
import {
  grayscale,
  mirror,
  invert,
  saturation,
  sepia,
  red,
  green,
  blue,
} from 'lena.js'
import { Badge } from '@chakra-ui/react'
import Sentiment from 'sentiment'
import { useRouter } from 'next/router'
import { createClient } from '@supabase/supabase-js'

const setimentScoreToNameColor = (score) => {
  if (score < -3.5) {
    return { name: 'toxically negative', color: 'red.600' }
  } else if (score > 3.5) {
    return { name: 'manically positive', color: 'green.600' }
  } else if (score < -0.5) {
    return { name: 'seemingly negative', color: 'red.400' }
  } else if (score > 0.5) {
    return { name: 'seemingly positive', color: 'green.400' }
  } else {
    return { name: 'neutral', color: 'gray.400' }
  }
}

function loadImage(dataURI) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = dataURI

    image.onload = () => resolve(image)
    image.onerror = (error) => reject(error)
  })
}

async function modifyDataURI(dataURI, filter) {
  try {
    const image = await loadImage(dataURI)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height

    ctx.drawImage(image, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    filter(imageData)
    ctx.putImageData(imageData, 0, 0)
    const newDataURI = canvas.toDataURL()
    return newDataURI
  } catch (error) {
    console.error('Error getting pixel data:', error)
    return null
  }
}

const addRandomImageEffect = async (imageDataURI, shouldFilter) => {
  if (!shouldFilter) return { effect: 'none', data: imageDataURI }
  const effects = [
    grayscale,
    mirror,
    invert,
    saturation,
    sepia,
    red,
    green,
    blue,
  ]
  const randomEffect = effects[Math.floor(Math.random() * effects.length)]
  const imageData = await modifyDataURI(imageDataURI, randomEffect)
  return { effect: randomEffect.name, data: imageData }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_ROLE,
)

export const RenderComponent = () => {
  const [textToRender, setTextToRender] = useState('')
  const [dataURI, setDataURI] = useState('')
  const [loading, setLoading] = useState(false)
  const [textSentiment, setTextSentiment] = useState(null)
  const [cig, setCig] = useState(null)
  const [effect, setEffect] = useState(null)
  const inputRef = useRef(null)
  const buttonRef = useRef(null)
  const [shouldFilter, setShouldFilter] = useState(false)
  const [pastCreations, setPastCreations] = useState([])

  const [renderData, setRenderData] = useState(null)

  const [renderCounter, setRenderCounter] = useState(null)
  const router = useRouter()

  const render = async (text) => {
    let sent = new Sentiment()
    let score = sent.analyze(text).score
    setLoading(true)
    setCig(null)

    const bdata = await getImageBufferData(text)
    let dataURI = bdata['data']
    let addEffect = await addRandomImageEffect(dataURI, shouldFilter)
    dataURI = addEffect.data

    await incrementRenderCounter()
    setEffect(addEffect.effect)
    setTextSentiment(setimentScoreToNameColor(score))
    setPastCreations((pastCreations) => [dataURI, ...pastCreations])
    setDataURI(dataURI)
    setCig(bdata['cig'])
    setLoading(false)
  }

  async function getRenderData() {
    const { data } = await supabase
      .from('renders')
      .select('*')
      .eq('id', 1)
      .single()
    setRenderData(data)
    setRenderCounter(data.views)
    return data.views
  }

  async function incrementRenderCounter() {
    const views = await getRenderData()
    const { data, error } = await supabase
      .from('renders')
      .update({ views: views + 1 })
      .eq('id', 1)
    if (error) {
      console.log('error', error)
    }
    setRenderCounter(views + 1)
  }

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  useEffect(() => {
    buttonRef.current.addEventListener('click', () => {
      party.confetti(buttonRef.current)
    })
  }, [])

  useEffect(() => {
    getRenderData()
  }, [])

  return (
    <Box
      width="min(90%, 500px)"
      display="flex"
      flexDir="column"
      alignItems="center"
    >
      <Input
        w="100%"
        margin="7px"
        placeholder="Cigbot render..."
        onChange={(e) => {
          setTextToRender(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            render(textToRender)
            party.confetti(buttonRef.current)
          }
        }}
        ref={inputRef}
      />
      <Button
        w="100%"
        margin="7px"
        variant="solid"
        onClick={() => render(textToRender)}
        loadingText="Rendering..."
        isLoading={loading}
        backgroundColor="orange.400"
        color="white"
        ref={buttonRef}
        _hover={{ backgroundColor: 'orange.500' }}
      >
        Render!
      </Button>
      <Stack
        spacing={[1, 5]}
        direction={['column', 'row']}
        border="3px solid #f5f5f5"
        borderRadius="6px"
        padding="7px"
        margin="7px"
        width="100%"
      >
        <Checkbox
          size="md"
          colorScheme="red"
          onChange={(e) => setShouldFilter(e.target.checked)}
        >
          Filter my cigawette 🚬
        </Checkbox>
      </Stack>
      <Box>
        <chakra.h1
          mb={6}
          fontSize={{
            base: '4xl',
            md: '2xl',
          }}
          fontWeight="bold"
          lineHeight="none"
          letterSpacing={{
            base: 'normal',
            md: 'tight',
          }}
          color="gray.900"
          _dark={{
            color: 'gray.100',
          }}
        >
          <Text
            display={{
              base: 'block',
              lg: 'inline',
            }}
            w="full"
            bgClip="text"
            bgGradient="linear(to-r, green.400,purple.500)"
            fontWeight="extrabold"
          >
            {renderCounter ? renderCounter : '...'}
          </Text>{' '}
          cigs rendered since Mon, Apr 17, 2023
        </chakra.h1>
      </Box>
      {dataURI == '' ? (
        <></>
      ) : (
        <Box>
          <Downloadable fileURL={dataURI} filename="render.png">
            <ChakraImage
              borderRadius="6px"
              marginY="7px"
              src={dataURI}
              alt="A cig"
            />
          </Downloadable>
          {cig && (
            <Flex justifyContent="space-around">
              <Badge padding="10px" variant="solid" colorScheme="green">
                cig: {cig}
              </Badge>
              {textSentiment && (
                <Badge
                  padding="10px"
                  variant="solid"
                  backgroundColor={textSentiment.color}
                >
                  sentiment: {textSentiment.name}
                </Badge>
              )}
              {effect && effect != 'none' && (
                <Badge padding="10px" variant="solid" colorScheme="blue">
                  filter: {effect}
                </Badge>
              )}
            </Flex>
          )}
          <Box margin="20px">
            <Text>made to commemorate cigbot 2023-2023</Text>
            <Text color="blue">
              <Link href="https://twitter.com/cigawrettepacks">smoke cigs</Link>
            </Text>
            <Box border="1px solid black" p={4} m={2} borderRadius="2xl">
              <Text>RIP pappachaga August 2020-Apr 2023</Text>
              <Link
                fontStyle="italic"
                fontSize="xs"
                p={5}
                color="red.400"
                href="https://twitter.com/pappachaga/status/1644366025998184451?s=20"
              >
                logging off is the only avant garde act left to do on the
                internet
              </Link>
            </Box>
            <Stack direction="row">
              <Link color="blue" href="https://github.com/karpapy/cignetsysx">
                the code
              </Link>
              <Text> | </Text>
              <Link color="blue" href="https://cigawrettebot.com/">
                official renderer
              </Link>
              <Text> | </Text>
              <Link color="blue" href="https://twitter.com/karpapy">
                @karpapy
              </Link>
              <Text> | </Text>
              <Link color="blue" href="https://twitter.com/cryptocojak">
                @shrimpfarmer
              </Link>
            </Stack>
          </Box>
        </Box>
      )}
      {pastCreations.length > 0 && (
        <>
          <Box width="100%">
            <Text>creations</Text>
            <Box display="flex" flexWrap="wrap" flexDir="row">
              {pastCreations.map((e, i) => {
                return (
                  <Downloadable key={i} fileURL={e} filename="render.png">
                    <ChakraImage
                      width="300px"
                      margin="10px"
                      key={i}
                      src={e}
                      alt="a cig"
                    />
                  </Downloadable>
                )
              })}
            </Box>
          </Box>
          <Box
            width="100%"
            mt={6}
            backgroundColor="whatsapp.400"
            textAlign="center"
            p={1}
          >
            <Text>~ words make love with one another ~</Text>
          </Box>
        </>
      )}
    </Box>
  )
}
