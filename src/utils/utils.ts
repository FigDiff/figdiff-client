export function isValidFigmaUrl(url: string) {
  const urlRegex =
    /^https:\/\/www\.figma\.com\/design\/[A-Za-z0-9]{22}\/([A-Za-z0-9-._~%!$&'()*+,;=:@]|%[A-Fa-f0-9]{2})+(\?node-id=[0-9-]+)?(&node-type=frame)(&t=[A-Za-z0-9-]+)?$/;

  return urlRegex.test(url);
}
