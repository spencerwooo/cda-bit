import * as cheerio from 'cheerio'

export async function getChannels(station: string) {
  // fetch html
  const res = await fetch(station, { cache: 'no-store' })
  const data = await res.text()

  // parse markup with cheerio
  const $ = cheerio.load(data)

  // script tag without src attribute is what we want
  const markup = $('script:not([src])').first().html()
  if (markup === null) {
    return { error: 'script tag not found' }
  }

  // find markup with regex /details = {.*}/
  const match = markup.match(/details = {.*}/)
  if (match === null) {
    return { error: 'details not found' }
  }

  // extract json by removing leading "details = " and trailing ";"
  const rawDetails = match[0].replace('details = ', '').replace(';', '')
  const details = JSON.parse(rawDetails)

  return details
}
