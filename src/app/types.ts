import { object, type Output, string, url, maxLength, minLength } from 'valibot'

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

export const StationSchema = object({
  name: string([
    minLength(1, '充电站名称不能为空'),
    maxLength(30, '充电站名称不能超过30个字符'),
  ]),
  url: string([url('链接格式不正确')]),
})

export type StationData = Output<typeof StationSchema>
