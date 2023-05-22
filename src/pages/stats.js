import Head from "next/head";
import { Inter } from "next/font/google";
import { Box, Heading, Text, Flex, Link } from "@chakra-ui/react";
import { RenderComponent } from "@/components/Render";
import { Annoucement } from "@/components/Announcement";
import React from "react";
import { Logger } from "@/components/Logger";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/get-stats");
      const data = await response.json();

      if (!data.genData) {
        return;
      }

      const dates = data.genData.map((d) => {
        return {
          date: new Date(d.name),
          renders: d.renders,
        };
      });

      dates.sort((a, b) => {
        return a.date - b.date;
      });

      setData(dates);
      setLoading(false);
    };
    fetchData();
  }, []);

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
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Annoucement />
      <Box
        display="flex"
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        w="100%"
      >
        <Box display="flex" alignItems="center" flexDir="column" w="100%">
          <Heading fontSize="3vh" margin="20px">
            STATISTICS
          </Heading>
        </Box>
        <Box>
          <Text fontSize="3vh" fontFamily="monospace">
            Renders:
          </Text>
        </Box>
        <Box width="100%" height={400} my={5} maxW="800px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="renders" name="cigbot.lol renders" fill="#e6752a" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      <Flex
        w="100%"
        justifyContent="center"
        alignItems="center"
        flexDir="column"
      >
        <Link pt={5} href="/">
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
