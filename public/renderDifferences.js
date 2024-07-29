chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "renderDifferences") {
    const data = message.data;

    renderDifferences(data);
  }
});

function renderDifferences(data) {
  document.body.replaceChildren();

  const screenshotBuffer = new Uint8Array(data.screenshotBuffer.data);
  const screenshotBlob = new Blob([screenshotBuffer], { type: "image/png" });
  const screenshotUrl = URL.createObjectURL(screenshotBlob);
  const screenshotImage = document.createElement("img");

  screenshotImage.classList.add("screenshot-image");

  screenshotImage.src = screenshotUrl;

  screenshotImage.style.position = "absolute";
  screenshotImage.style.left = "1.5px";
  screenshotImage.style.top = "1.5px";
  screenshotImage.style.border = "0px";

  document.body.appendChild(screenshotImage);

  data.differentFigmaNodes.forEach((node, index) => {
    const { x, y, width, height } = node.absoluteBoundingBox;
    const imageBuffer = new Uint8Array(data.imagesArray[index].data);
    const blob = new Blob([imageBuffer], { type: "image/png" });
    const imageUrl = URL.createObjectURL(blob);

    const diffContainer = document.createElement("div");

    diffContainer.classList.add("figma-image");

    diffContainer.style.position = "absolute";
    diffContainer.style.left = `${x}px`;
    diffContainer.style.top = `${y}px`;
    diffContainer.style.width = `${width}px`;
    diffContainer.style.height = `${height}px`;
    diffContainer.style.zIndex = "9999";
    diffContainer.style.pointerEvents = "none";
    diffContainer.style.border = "2px solid green";
    diffContainer.style.opacity = "0.2";

    const diffImage = document.createElement("img");
    diffImage.src = imageUrl;

    diffContainer.appendChild(diffImage);
    document.body.appendChild(diffContainer);
  });

  const existingScreenshot = document.querySelector(".screenshot-image");
  const screenshotOpacityHandler = document.createElement("input");

  screenshotOpacityHandler.setAttribute("type", "range");
  screenshotOpacityHandler.style.position = "absolute";
  screenshotOpacityHandler.style.left = "0px";
  screenshotOpacityHandler.style.top = "0px";
  screenshotOpacityHandler.style.width = "150px";
  screenshotOpacityHandler.value = 100;

  document.body.appendChild(screenshotOpacityHandler);

  screenshotOpacityHandler.addEventListener("input", () => {
    const screenshotOpacityValue = screenshotOpacityHandler.value / 100;

    existingScreenshot.style.opacity = screenshotOpacityValue;
  });

  const figmaImages = document.querySelectorAll(".figma-image");
  const figmaImagesOpacityHandler = document.createElement("input");

  figmaImagesOpacityHandler.setAttribute("type", "range");
  figmaImagesOpacityHandler.style.position = "absolute";
  figmaImagesOpacityHandler.style.left = "0px";
  figmaImagesOpacityHandler.style.top = "25px";
  figmaImagesOpacityHandler.style.width = "150px";
  figmaImagesOpacityHandler.value = 20;

  document.body.appendChild(figmaImagesOpacityHandler);

  figmaImagesOpacityHandler.addEventListener("input", () => {
    const divOpacityValue = figmaImagesOpacityHandler.value / 100;

    figmaImages.forEach((element) => {
      element.style.opacity = divOpacityValue;
    });
  });
}
