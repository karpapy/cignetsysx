import Head from "next/head";
import { Inter } from "next/font/google";
import { Box, Heading, Text } from "@chakra-ui/react";
import { RenderComponent } from "@/components/Render";
import { Annoucement } from "@/components/Announcement";
import React from "react";

export default function Home() {
  const [userDidRenderAtLeastOnce, setUserDidRenderAtLeastOnce] =
    React.useState(false);

  return (
    <>
      <Head>
        <title>Cigbot render online</title>
        <meta
          name="description"
          content="Generate custom cigs online free now"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Annoucement />
      <Box
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        w="95vw"
      >
        <Box display="flex" alignItems="center" flexDir="column" w="100%">
          <Heading fontSize="3vh" margin="20px">
            100% aligned agi simulator
          </Heading>
          <RenderComponent setUserDidRender={setUserDidRenderAtLeastOnce} />
        </Box>
      </Box>
      {userDidRenderAtLeastOnce && (
        <Box
          width="100%"
          mt={6}
          backgroundColor="whatsapp.400"
          textAlign="center"
          p={1}
        >
          <Text>~ words make love with one another ~</Text>
        </Box>
      )}
    </>
  );
}
