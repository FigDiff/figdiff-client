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
  screenshotImage.style.left = "0px";
  screenshotImage.style.top = "0px";

  document.body.appendChild(screenshotImage);

  const diffContainer = document.createElement("div");
  diffContainer.classList.add("diff-Container");
  diffContainer.style.position = "absolute";
  diffContainer.style.left = "0px";
  diffContainer.style.top = "0px";

  data.differentFigmaNodes.forEach((node, index) => {
    const { x, y, width, height } = node.absoluteBoundingBox;
    const imageBuffer = new Uint8Array(data.imagesArray[index].data);
    const blob = new Blob([imageBuffer], { type: "image/png" });
    const imageUrl = URL.createObjectURL(blob);

    const diffImage = document.createElement("img");
    diffImage.classList.add("figma-image");
    diffImage.style.position = "absolute";
    diffImage.style.left = `${x}px`;
    diffImage.style.top = `${y}px`;
    diffImage.style.width = `${width}px`;
    diffImage.style.height = `${height}px`;
    diffImage.style.zIndex = "9999";
    diffImage.style.pointerEvents = "none";
    diffImage.style.border = "2px solid green";
    diffImage.src = imageUrl;

    diffContainer.appendChild(diffImage);
  });

  document.body.appendChild(diffContainer);

  createCombinedOpacityControl();
}

function createCombinedOpacityControl() {
  const controlBox = document.createElement("div");
  controlBox.style.position = "absolute";
  controlBox.style.top = "0px";
  controlBox.style.left = "0px";
  controlBox.style.padding = "10px";
  controlBox.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
  controlBox.style.border = "1px solid #ccc";
  controlBox.style.borderRadius = "5px";
  controlBox.style.cursor = "move";
  controlBox.style.zIndex = "10000";

  const webpageLabel = document.createElement("label");
  webpageLabel.textContent = "Webpage 조절하기";
  webpageLabel.style.display = "block";
  webpageLabel.style.marginBottom = "5px";

  const webpageSlider = document.createElement("input");
  webpageSlider.setAttribute("type", "range");
  webpageSlider.style.width = "150px";
  webpageSlider.value = 100;

  const figmaLabel = document.createElement("label");
  figmaLabel.textContent = "Figma Design 조절하기";
  figmaLabel.style.display = "block";
  figmaLabel.style.margin = "10px 0 5px 0";

  const figmaSlider = document.createElement("input");
  figmaSlider.setAttribute("type", "range");
  figmaSlider.style.width = "150px";
  figmaSlider.value = 20;

  controlBox.appendChild(webpageLabel);
  controlBox.appendChild(webpageSlider);
  controlBox.appendChild(figmaLabel);
  controlBox.appendChild(figmaSlider);

  document.body.appendChild(controlBox);
  let isDragging = false;
  let offsetX, offsetY;

  controlBox.addEventListener("mousedown", (event) => {
    if (event.targeventt !== webpageSlider && event.target !== figmaSlider) {
      isDragging = true;
      offsetX = event.clientX - controlBox.getBoundingClientRect().left;
      offsetY = event.clientY - controlBox.getBoundingClientRect().top;
      controlBox.style.cursor = "grabbing";
    }
  });

  document.addEventListener("mousemove", (event) => {
    if (isDragging) {
      controlBox.style.left = `${event.clientX - offsetX}px`;
      controlBox.style.top = `${event.clientY - offsetY}px`;
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
    controlBox.style.cursor = "move";
  });

  webpageSlider.addEventListener("input", () => {
    const opacityValue = webpageSlider.value / 100;
    document.querySelector(".screenshot-image").style.opacity = opacityValue;
  });

  figmaSlider.addEventListener("input", () => {
    const opacityValue = figmaSlider.value / 100;
    document.querySelector(".diff-Container").style.opacity = opacityValue;
  });

  webpageSlider.addEventListener("mousedown", (event) => {
    event.stopPropagation();
  });

  figmaSlider.addEventListener("mousedown", (event) => {
    event.stopPropagation();
  });
}
