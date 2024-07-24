chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "renderDifferences") {
    const data = message.data;
    const tabUrl = message.tabUrl;

    renderDifferences(data, tabUrl);
  }
});

function renderDifferences(data, tabUrl) {
  document.body.replaceChildren();

  const iframe = document.createElement("iframe");

  iframe.setAttribute("src", `${tabUrl}`);
  iframe.setAttribute("width", `${data.figmaWidth}`);
  iframe.setAttribute("height", `${data.figmaHeight}`);

  iframe.style.position = "absolute";
  iframe.style.left = "1.5px";
  iframe.style.top = "1.5px";
  iframe.style.border = "0px";

  document.body.appendChild(iframe);

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

  const existingIframe = document.querySelector("iframe");
  const iframeOpacityHandler = document.createElement("input");

  iframeOpacityHandler.setAttribute("type", "range");
  iframeOpacityHandler.style.position = "absolute";
  iframeOpacityHandler.style.left = "0px";
  iframeOpacityHandler.style.top = "0px";
  iframeOpacityHandler.style.width = "150px";
  iframeOpacityHandler.value = 100;

  document.body.appendChild(iframeOpacityHandler);

  iframeOpacityHandler.addEventListener("input", () => {
    const iframeOpacityValue = iframeOpacityHandler.value / 100;

    existingIframe.style.opacity = iframeOpacityValue;
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
