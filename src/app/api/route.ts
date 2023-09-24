import { NextRequest, NextResponse } from 'next/server'

export interface ChannelDetails {
  rateList: RateList[]
  returnCode: string
  operatorId: number
  deviceModel: string
  lockBalance: number
  fullStop: string
  channelMap: { [key: string]: ChannelMap }
  GID: string
  balance: number
  acctRecharge: boolean
  chargeOption: string
  deviceName: string
  prepay: boolean
  userId: number
  defaultChargeOption: number
  merchantNo: string
  chargeType: number
  siteName: string
  customWord: number
  regionId: number
}

export interface ChannelMap {
  channelStatus: ChannelStatus
  chargedQuantity: number
  chargedTime: number
  chargeI: number
  chargeU: number
  userId: number
  payAmount: number
  resultCode: number
  resultMsg: ResultMsg
  startChargeTime: number
}

export enum ChannelStatus {
  D = 'D',
  E = 'E',
  I = 'I',
  C = 'C',
  P = 'P',
}

export enum ResultMsg {
  Suc = 'SUC',
}

export interface RateList {
  stepId: number
  deviceId: number
  stepType: string
  power: number
  unitTime: number
  unitAmount: number
  operatorId: number
}

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
