// pages/_app.js
import { CigDataProvider } from "@/components/CigDataProvider";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <CigDataProvider>
        <Component {...pageProps} />
      </CigDataProvider>
    </ChakraProvider>
  );
}

export default MyApp;
