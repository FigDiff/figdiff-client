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

  controlBox.addEventListener("mousedown", (e) => {
    if (e.target !== webpageSlider && e.target !== figmaSlider) {
      isDragging = true;
      offsetX = e.clientX - controlBox.getBoundingClientRect().left;
      offsetY = e.clientY - controlBox.getBoundingClientRect().top;
      controlBox.style.cursor = "grabbing";
    }
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      controlBox.style.left = `${e.clientX - offsetX}px`;
      controlBox.style.top = `${e.clientY - offsetY}px`;
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
    document.querySelectorAll(".figma-image").forEach((element) => {
      element.style.opacity = opacityValue;
    });
  });

  webpageSlider.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });

  figmaSlider.addEventListener("mousedown", (e) => {
    e.stopPropagation();
  });
}
