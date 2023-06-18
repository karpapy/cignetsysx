// pages/_app.js
import { CigDataProvider } from "@/components/CigDataProvider";
import CommandBarMain from "@/components/CommandbarMain";
import { ChakraProvider } from "@chakra-ui/react";
import {
  WagmiConfig,
  createClient,
  configureChains,
  mainnet,
  goerli,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <CommandBarMain />
      <CigDataProvider>
        <WagmiConfig client={client} chains={chains}>
          <Component {...pageProps} />
        </WagmiConfig>
      </CigDataProvider>
    </ChakraProvider>
  );
}

export default MyApp;
