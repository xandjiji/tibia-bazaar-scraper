export const sanitizeHtmlString = (html: string): string => {
  let sanitizedHtml = html.replace(/ /g, ' ')

  return sanitizedHtml
}
