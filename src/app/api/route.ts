import { ChannelDetails } from '../types'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Fetches channel details from a given station URL.
 * @param station - The URL of the station to fetch channel details from.
 * @returns A promise that resolves to the channel details or an error object.
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.nextUrl)
  const station = url.searchParams.get('station')
  if (station === null) {
    return new Response('station not found', { status: 500 })
  }

  // fetch html
  const res = await fetch(station)
  const data = await res.text()

  // // parse markup with cheerio
  // const $ = cheerio.load(data)

  // // script tag without src attribute is what we want
  // const markup = $('script:not([src])').first().html()
  // if (markup === null) {
  //   return { error: 'script tag not found' }
  // }

  // find markup with regex /details = {.*}/
  const match = data.match(/details = {.*}/)
  if (match === null) {
    return new Response('details not found', { status: 500 })
  }

  // extract json by removing leading "details = " and trailing ";"
  const rawDetails = match[0].replace('details = ', '').replace(';', '')
  const details = JSON.parse(rawDetails) as ChannelDetails

  return NextResponse.json(details)
}
