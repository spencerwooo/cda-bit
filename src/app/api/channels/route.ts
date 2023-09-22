import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const station = url.searchParams.get('station')
  if (station === null) {
    return new NextResponse('station parameter is required', { status: 400 })
  }

  // fetch html
  const res = await fetch(station)
  const data = await res.text()

  // parse markup with cheerio
  const $ = cheerio.load(data)

  // script tag without src attribute is what we want
  const markup = $('script:not([src])').first().html()
  if (markup === null) {
    return new NextResponse('script tag not found', { status: 500 })
  }

  // find markup with regex /details = {.*}/
  const match = markup.match(/details = {.*}/)
  if (match === null) {
    return new NextResponse('details not found', { status: 500 })
  }

  // extract json by removing leading "details = " and trailing ";"
  const rawDetails = match[0].replace('details = ', '').replace(';', '')
  const details = JSON.parse(rawDetails)

  return NextResponse.json(details)
}
