import React from "react";
import blanks from "@/lib/blanks.json";

const loadXR = (data, key) => {
  const dataBuffer = Buffer.from(data);
  const keyBuffer = Buffer.from(key);
  let out = Buffer.alloc(dataBuffer.length);

  for (let i = 0; i < dataBuffer.length; i++) {
    out[i] = dataBuffer[i] ^ keyBuffer[i % keyBuffer.length];
  }

  return out;
};

export const serializeXR = (data, key) => {
  const xorResult = loadXR(data, key);
  return xorResult.toString("base64");
};

export const deserializeXR = (data, key) => {
  const dataBuffer = Buffer.from(data, "base64");
  const xorResult = loadXR(dataBuffer, key);
  return xorResult.toString();
};

export const useXR = (data, key) => {
  const [result, setResult] = React.useState(null);
  React.useEffect(() => {
    if (data && key) {
      setResult(deserializeXR(data, key));
    }
  }, [data, key]);
  return result;
};

export async function fetchRenderDataAndSave() {
  const dat = await fetch("/ld.txt");
  const data = await dat.text();
  const deserialized_data = JSON.parse(deserializeXR(data, "in-cig-we-trust"));
  const final = deserialized_data.filter((x) => {
    const num = parseInt(x["name"].replace("#", ""));
    return blanks.indexOf(num) !== -1;
  });
  return final;
}

export async function getRenderData() {
  const deserialized_data = await fetchRenderDataAndSave();
  return deserialized_data;
}

export const sayHello = async (cignum, caption) => {
  // get the basename of the url
  const url = window.location.href
    .replace(/\/$/, "")
    .replace("https://", "")
    .replace("http://", "");
  let origin = "lol";
  if (url === "localhost:3000") {
    origin = "dev";
  } else if (url === "cigbot.life") {
    origin = "life";
  }

  await fetch("/api/hello", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      caption: caption,
      cignum,
      origin,
    }),
  });
};
