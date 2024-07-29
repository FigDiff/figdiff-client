chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "canvasScreenShot") {
    takeScreenshot()
      .then((result) => {
        sendResponse({ status: "success", result });
      })
      .catch((error) => {
        sendResponse({ status: "error", message: error.message });
      });

    return true;
  }
});

async function takeScreenshot() {
  try {
    const screenshotImage = document.querySelector(".screenshot-image");
    const diffContainer = document.querySelector(".diff-Container");

    if (!screenshotImage) {
      throw new Error("No element with class 'screenshot-image' found");
    }

    const screenshotBase64 = await captureScreenshotImage(screenshotImage);
    const diffBase64 = diffContainer
      ? await captureDiffContainer(diffContainer, screenshotImage)
      : null;

    return { screenshotBase64, diffBase64 };
  } catch (error) {
    console.error("Error taking screenshot:", error);
    throw error;
  }
}

function captureScreenshotImage(imageElement) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;

  ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    resolve(canvas.toDataURL("image/png"));
  });
}

async function captureDiffContainer(containerElement, referenceImage) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to get canvas context");
  }

  canvas.width = referenceImage.naturalWidth;
  canvas.height = referenceImage.naturalHeight;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const images = Array.from(containerElement.getElementsByTagName("img"));

  const imagePromises = images.map(
    (img) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = img.src;

        image.onload = () => {
          const imgRect = img.getBoundingClientRect();
          const refRect = referenceImage.getBoundingClientRect();
          const x = imgRect.left - refRect.left;
          const y = imgRect.top - refRect.top;
          resolve({
            image,
            x,
            y,
            width: imgRect.width,
            height: imgRect.height,
          });
        };
        image.onerror = reject;
      }),
  );

  const loadedImages = await Promise.all(imagePromises);

  loadedImages.forEach(({ image, x, y, width, height }) => {
    ctx.drawImage(image, x, y, width, height);
    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  });

  return new Promise((resolve) => {
    resolve(canvas.toDataURL("image/png"));
  });
}
