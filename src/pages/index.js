import Head from "next/head";
import { Inter } from "next/font/google";
import { Box, Heading, Text } from "@chakra-ui/react";
import { RenderComponent } from "@/components/Render";
import { Annoucement } from "@/components/Announcement";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
          <RenderComponent />
        </Box>
      </Box>
    </>
  );
}
