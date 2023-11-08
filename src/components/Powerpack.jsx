import React, { useState, useRef } from "react";
import { Downloadable } from './Downloadable';
import {Input, Button, Stack, Image as ChakraImage, Box} from "@chakra-ui/react";

export const Stamp = () => {
  const canvasRef = useRef(null);
  const [combinedImage, setCombinedImage] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");

  // Function to fetch a random image from IPFS
  const fetchRandomIPFSImage = () => {
    const gatewayBaseUrl = 'https://ipfs.io/ipfs/QmQnc5a7dLZnkhH5cLjpA9RnB8moa99DKidoaD6UpuRB8g/';
    const randomNumber = Math.floor(Math.random() * 222);
    return `${gatewayBaseUrl}${randomNumber}.png`;
  };

  // Helper function to wrap text
  const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        context.fillText(line, x, y);
        context.strokeText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    context.fillText(line, x, y);
    context.strokeText(line, x, y);
  };

  // Helper function to calculate the height of the wrapped text
  const calculateWrappedTextHeight = (context, text, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let lineCount = 0;
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = context.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        line = words[n] + ' ';
        lineCount++;
      } else {
        line = testLine;
      }
    }
    if (line !== '') {
      lineCount++;
    }
    return lineCount * lineHeight;
  };

// Function to determine an appropriate line height multiplier based on font size
const getLineHeightMultiplier = (fontSize) => {
  if (fontSize >= 50) {
    return 1.2; // Larger multiplier for larger text
  } else if (fontSize >= 30) {
    return 1.0; // Medium multiplier for medium text
  } else {
    return 0.8; // Smaller multiplier for smaller text
  }
};

// Function to get additional offset based on the font size
const getAdditionalOffset = (fontSize) => {
  if (fontSize > 30) {
    return fontSize * 0.5; // Adjust this multiplier as needed to push the text further down
  } else {
    return 0; // No additional offset for fonts <= 30
  }
};

  // Function to dynamically resize font
  const getFontSizeForText = (context, text, maxWidth, fontSize, fontFace, minFontSize = 25) => {
    let currentFontSize = fontSize;
    do {
      context.font = `${currentFontSize}px ${fontFace}`;
      if (context.measureText(text).width <= maxWidth || currentFontSize <= minFontSize) {
        break; // Break the loop if text fits or we reach the minimum font size
      }
      currentFontSize -= 1; // Reduce font size by 1 and try again
    } while (true); // Infinite loop, we break it manually
    return `${currentFontSize}px ${fontFace}`; // Return the font size, which won't be less than minFontSize
  };

  const combineImages = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    const randomImageUrl = fetchRandomIPFSImage();
    console.log("Attempting to load image:", randomImageUrl);
  
    const img1 = new Image();
    img1.crossOrigin = "anonymous";
    img1.src = randomImageUrl;
  
    img1.onload = () => {
      console.log("Image loaded successfully");
      canvas.width = img1.width;
      canvas.height = img1.height;
      ctx.drawImage(img1, 0, 0, canvas.width, canvas.height);
  
      const maxWidth = canvas.width * 0.95;
      const fontFace = "Impact";
  
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
  
      // Top text
      ctx.font = getFontSizeForText(ctx, topText, maxWidth, 60, fontFace);
      const topFontSize = parseInt(ctx.font, 10); // Extract font size from context
      const topLineHeight = topFontSize * getLineHeightMultiplier(topFontSize);
      wrapText(ctx, topText, canvas.width / 2, 60, maxWidth, topLineHeight);
  
      // Bottom text
      ctx.font = getFontSizeForText(ctx, bottomText, maxWidth, 60, fontFace);
      const bottomFontSize = parseInt(ctx.font, 10); // Extract font size from context
      const bottomLineHeight = bottomFontSize * getLineHeightMultiplier(bottomFontSize);
      let bottomTextHeight = calculateWrappedTextHeight(ctx, bottomText, maxWidth, bottomLineHeight);
      let additionalOffset = getAdditionalOffset(bottomFontSize); // Get additional offset based on font size
      let bottomTextY = canvas.height - bottomTextHeight + additionalOffset; // Adjust the Y position for the bottom text with additional offset
      wrapText(ctx, bottomText, canvas.width / 2, bottomTextY, maxWidth, bottomLineHeight);
  
      setCombinedImage(canvas.toDataURL('image/png'));
    };
  
    img1.onerror = () => {
      console.error("Failed to load image from IPFS");
    };
  };

  return (
    <Box display="flex" flexWrap="wrap" maxWidth="500px" margin="auto" position="relative">
      <Box flexBasis="100%" p="2">
        <Stack spacing={4} marginBottom="4">
          <Input
            placeholder="Top Text"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
          />
          <Input
            placeholder="Bottom Text"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
          />
        </Stack>
        <Button
          width="100%"
          my="2"
          colorScheme="orange"
          variant="solid"
          onClick={combineImages}
        >
          Add text to powerpack!
        </Button>
      </Box>
      {combinedImage && (
        <Box position="relative">
          <ChakraImage src={combinedImage} alt="powerpack" maxW="100%" />
          <Box position="absolute" top="5" right="5">
            <Downloadable fileURL={combinedImage} filename="powerpack-meme.png">
            </Downloadable>
          </Box>
        </Box>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Box>
  );
};
