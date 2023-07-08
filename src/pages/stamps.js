import Head from "next/head";
import { Box, Heading, Text, Flex, Link } from "@chakra-ui/react";
import { Stamp } from "@/components/Crop";
import { Annoucement } from "@/components/Announcement";
import React from "react";

export default function Home() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Place image above the line.</title>
        <meta
          name="description"
          content="Generate custom cigs online free now"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Annoucement />
      <div style={{ marginBottom: "100px" }}>
        <Box
          display="flex"
          flexDir="column"
          justifyContent="center"
          alignItems="center"
          w="100%"
        >
          <Box display="flex" alignItems="center" flexDir="column" w="100%">
            <Heading fontSize="3vh" margin="20px">
            ~*STAMP BRAND CIGAWRETTES*~ 
            </Heading>
          </Box>
          <Box width="100%" height={400} my={5} maxW="800px">
            <Stamp />
          </Box>
        </Box>
      </div>
      <Flex
        w="100%"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        <Link pt={20} href="/">
          {"<-"} back to render
        </Link>
        <Box
          width="fit-content"
          mt={6}
          backgroundColor="whatsapp.400"
          textAlign="center"
          p={1}
        >
          <Text>~ words make love with one another ~</Text>
        </Box>
      </Flex>
    </>
  );
}
