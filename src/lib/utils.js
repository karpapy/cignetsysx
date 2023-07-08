export const fullyEncodeURI = (value) =>
  encodeURIComponent(value)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2a")
    .replace(/~/g, "%7e");

export const putLabel = async (imageURL, label, textColor) => {
  //   Do some CORS stuff
  let url = imageURL;
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = url;

  // Wrap the image loading in a Promise to make the function async
  const loadPromise = new Promise((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = (error) => {
      console.log("err", error);
    };
  });
  await loadPromise;

  // downsample the original by half
  const IMAGE_WIDTH = 1728;
  const IMAGE_HEIGHT = 2160;
  // picked from testing
  const TEXT_X = 920;
  const TEXT_Y = 1500;
  const labelWidth = 480;
  const labelHeight = 225;

  let v8canvas = document.createElement("canvas");
  v8canvas.width = IMAGE_WIDTH;
  v8canvas.height = IMAGE_HEIGHT;
  let ctx = v8canvas.getContext("2d");

  ctx.drawImage(image, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";

  const formatText = (label, fontSize) => {
    ctx.font = `bold ${fontSize}px helvetica`;
    let allLines = [];
    // Split label by whitespace characters
    let words = label.split(/\s+/);
    // If a single word is greater than labelWidth, break it up
    let shortWords = [];
    words.forEach((word) => {
      if (ctx.measureText(word).width > labelWidth) {
        let wordParts = [];
        let currentPart = "";
        for (let i = 0; i < word.length; i++) {
          currentPart += word[i];
          if (ctx.measureText(currentPart).width > labelWidth) {
            wordParts.push(currentPart);
            currentPart = "";
          }
        }
        if (currentPart.length > 0) {
          wordParts.push(currentPart);
        }
        shortWords = shortWords.concat(wordParts);
      } else {
        shortWords.push(word);
      }
    });

    let curLine = shortWords[0];
    shortWords.forEach((word, index) => {
      if (index > 0) {
        let newWidth = ctx.measureText(curLine + " " + word).width;
        if (newWidth < labelWidth) {
          curLine += " " + word;
        } else {
          allLines.push(curLine);
          curLine = word;
        }
      }
    });
    allLines.push(curLine);
    return allLines;
  };

  let lines;
  let textHeight = labelHeight + 1;
  let textWidth = 0;
  let fontSize = 43;

  while (textHeight > labelHeight) {
    fontSize -= 1;
    // break up lines according to fontSize
    lines = formatText(label, fontSize);
    // calculate textHeight for this fontSize
    textHeight = 0;
    lines.forEach((line) => {
      let textMeasure = ctx.measureText(line);
      let fontHeight =
        textMeasure.fontBoundingBoxAscent + textMeasure.fontBoundingBoxDescent;
      textHeight += fontHeight;
      textWidth = Math.max(textWidth, textMeasure.width);
    });

    // set transformation with a deltaY fudge factor from testing
    let deltaY = 95 - textHeight / 2;
    ctx.setTransform(1.2, -0.215, -0.02, 1.5, TEXT_X, TEXT_Y + deltaY);
  }

  let y = 0; // current y-coordinate of the text baseline
  lines.forEach((line) => {
    let textMeasure = ctx.measureText(line);
    let fontHeight =
      textMeasure.fontBoundingBoxAscent + textMeasure.fontBoundingBoxDescent;
    let height = fontHeight / 2.2;

    ctx.fillStyle = textColor;
    ctx.fillText(line, 0, y);
    y += height; // increment y by a fraction of the height of the current line
    ctx.translate(0, height);
  });
  const IMG_BUFFER = v8canvas.toDataURL();
  return IMG_BUFFER;
};
