export function normalizeDocumentText(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .replace(/(Article|Section|Стаття)\s+(\d+)/gi, '$1 $2');
}
