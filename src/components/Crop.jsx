import React, { useState, createRef, useRef, useEffect } from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Downloadable } from './Downloadable'
import { Button } from '@chakra-ui/react'
import { loadCloudflareCache } from '@/lib/loader'

const defaultStamp = '/nusainq.png'

export const Stamp = () => {
  const [image, setImage] = useState(defaultStamp)
  const cropperRef = createRef(null)
  const canvasRef = useRef(null)
  const [combinedImage, setCombinedImage] = useState(null)

  const stampsblanks = [
    354,
    1155,
    1210,
    1368,
    1395,
    1407,
    1446,
    1528,
    1560,
    1576,
    165,
    1659,
    1727,
    1798,
    1829,
    1913,
    1965,
    1978,
    2022,
    2083,
    2291,
    2328,
    2388,
    2432,
    2551,
    2564,
    2615,
    2746,
    2780,
    2836,
    3035,
    3819,
  ]
  const [cigpack, setCigpack] = useState(
    `https://bafybeigvhgkcqqamlukxcmjodalpk2kuy5qzqtx6m4i6pvb7o3ammss3y4.ipfs.dweb.link/${stampsblanks[0]}.jpg`,
  )

  const randomizeCigpack = () => {
    const randomIndex = Math.floor(Math.random() * stampsblanks.length)
    setCigpack(
      `https://bafybeigvhgkcqqamlukxcmjodalpk2kuy5qzqtx6m4i6pvb7o3ammss3y4.ipfs.dweb.link/${stampsblanks[randomIndex]}.jpg`,
    )
  }

  const combineImages = () => {
    randomizeCigpack()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    // Load the first image
    const img1 = new Image()
    img1.crossOrigin = 'anonymous'
    img1.src = cigpack

    img1.onload = () => {
      // Draw the first image on the canvas

      const cigWidth = img1.width
      const cigHeight = img1.height
      canvas.width = cigWidth
      canvas.height = cigHeight
      ctx.drawImage(img1, 0, 0, canvas.width, canvas.height)
      console.log(canvas)

      // Get the cropped image from the Cropper component
      const croppedImage = cropperRef.current?.cropper
        .getCroppedCanvas()
        .toDataURL()

      // Load the cropped image
      const img2 = new Image()
      img2.crossOrigin = 'anonymous'
      img2.src = croppedImage

      img2.onload = () => {
        // Draw the second image on the canvas
        ctx.setTransform(1.2, -0.18, -0.02, 1.49, 0, 0)
        ctx.drawImage(img2, 980, 1300, 1160, 760)
        setCombinedImage(canvas.toDataURL('image/png'))
      }
    }
  }

  const onChange = (e) => {
    e.preventDefault()
    let files
    if (e.dataTransfer) {
      files = e.dataTransfer.files
    } else if (e.target) {
      files = e.target.files
    }
    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result)
    }
    const filename = files[0].name
    loadCloudflareCache({ page: 'stamp', stampfilename: filename })
    reader.readAsDataURL(files[0])
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <div style={{ flexBasis: '50%', padding: '10px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input type="file" onChange={onChange} />
        </div>
        <Cropper
          ref={cropperRef}
          initialAspectRatio={1}
          src={image}
          viewMode={1}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          guides={false}
        />
      </div>
      <div style={{ flexBasis: '50%', padding: '10px' }}>
        <div style={{ marginBottom: '10px' }}>
          <Button
            w="100%"
            margin="7px"
            variant="solid"
            backgroundColor="orange.400"
            color="white"
            _hover={{ backgroundColor: 'orange.500' }}
            onClick={combineImages}
          >
            Stamp it!
          </Button>
        </div>
        <Downloadable fileURL={combinedImage} filename="stamped-render.png">
          <canvas ref={canvasRef} style={{ width: '100%' }} />
        </Downloadable>
      </div>
    </div>
  )
}
