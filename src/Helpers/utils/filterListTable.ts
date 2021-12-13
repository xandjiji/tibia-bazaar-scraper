import cheerio, { Element } from 'cheerio'

const garbageClasses = new Set(['IndicateMoreEntries', 'LabelH'])

export const filterListTable = (index: number, element: Element) => {
  const parentClasses =
    cheerio(element).parent().attr('class')?.split(' ') ?? []

  return (
    index > 0 &&
    !parentClasses.some((className) => garbageClasses.has(className))
  )
}
