import { createClient } from "@supabase/supabase-js";
import { verifyMessage } from "ethers/lib/utils";
import fetch from "isomorphic-fetch";
import { ethers } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

let infuraURL = `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`;
if (process.env.DEBUG == "true") {
  infuraURL = `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`;
}
const provider = new JsonRpcProvider(infuraURL);

let ethURL = "https://api.etherscan.io/";
if (process.env.DEBUG == "true") {
  ethURL = "https://api-goerli.etherscan.io/";
}

async function waitForConfirmation(hash, provider) {
  const transaction = await provider.getTransaction(hash);
  if (!transaction) {
    throw new Error("Transaction not found");
  }
  const receipt = await provider.waitForTransaction(hash, 1);
  return receipt;
}

async function getTransactionHistory(address) {
  const apiKey = process.env.ETHERSCAN_API_KEY;
  const url = `${ethURL}api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  return data.result;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message, author, address, hash, messageSigned } = req.body;

    if (!message || !address || !hash || !messageSigned) {
      return res
        .status(400)
        .json({ error: "Message, address, hash, and signature required." });
    }

    const signer = verifyMessage(message, messageSigned);
    if (signer !== address) {
      return res.status(400).json({ error: "Invalid signature." });
    }

    const donationAddress = process.env.NEXT_PUBLIC_DONATION_ADDRESS;

    console.log("Waiting for confirmation...");
    await waitForConfirmation(hash, provider);
    console.log("Confirmed!");

    const transactions = await getTransactionHistory(donationAddress);

    if (
      transactions.length === 0 ||
      transactions[0].from.toLowerCase() !== address.toLowerCase()
    ) {
      console.log(transactions[0].from.toLowerCase(), address.toLowerCase());
      return res
        .status(400)
        .json({ error: "User is not the most recent donor." });
    }

    const { data, error } = await supabase
      .from("announcements")
      .insert([{ announcement: message, author }]);

    if (error) {
      console.error(error);
      return res.status(500).json({ error });
    }

    res.status(200).json({ data });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
