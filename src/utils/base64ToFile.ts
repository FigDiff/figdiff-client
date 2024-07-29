function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}

function base64ToFile(base64: string, fileName: string, mimeType: string) {
  const blob = base64ToBlob(base64, mimeType);
  return new File([blob], fileName, { type: mimeType });
}

export default base64ToFile;
