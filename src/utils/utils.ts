export function isValidFigmaUrl(url: string) {
  const regex =
    /^https:\/\/www\.figma\.com\/design\/[A-Za-z0-9]{22}\/[A-Za-z0-9-]+(\?node-id=[0-9-]+)?(&t=[A-Za-z0-9-]+)?$/;
  return regex.test(url);
}
