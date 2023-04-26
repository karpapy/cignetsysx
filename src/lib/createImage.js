import { putLabel, putLabel2 } from "./utils.js";
import blanks from "./blanks.json";

export const getImageBufferData = async (label, cignumber) => {
  const ipfs_url =
    "https://bafybeigvhgkcqqamlukxcmjodalpk2kuy5qzqtx6m4i6pvb7o3ammss3y4.ipfs.dweb.link";

  let randomCig = blanks[Math.floor(Math.random() * blanks.length)];
  if (cignumber !== null) randomCig = cignumber;

  let randomCigUrl = `${ipfs_url}/${randomCig}.jpg`;
  let data = await putLabel(randomCigUrl, label);
  return { data, cig: randomCig };
};
