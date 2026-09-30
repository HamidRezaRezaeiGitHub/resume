const rootMarker = '<div id="root"></div>'

export function injectPrerender(html: string, markup: string): string {
  if (html.split(rootMarker).length !== 2) {
    throw new Error('Expected exactly one empty root in the built homepage')
  }
  if (!markup.trim()) {
    throw new Error('The server-rendered homepage is empty')
  }
  return html.replace(rootMarker, () => `<div id="root">${markup}</div>`)
}
