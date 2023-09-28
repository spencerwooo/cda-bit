'use client'

import Image from 'next/image'
import Link from 'next/link'

import useLocalStorageState from 'use-local-storage-state'
import { safeParse } from 'valibot'

import Channel from '@/app/channel'
import { StationData, StationSchema } from '@/app/types'
import evHeaderImg from '@/app/header.png'

// const stations = [
//   {
//     name: '硕博2 #1',
//     url: 'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000001532&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
//   },
//   {
//     name: '硕博2 #2',
//     url: 'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000011639&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
//   },
//   {
//     name: '小麦公社西侧',
//     url: 'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000013510&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
//   },
//   {
//     name: '光电楼北侧',
//     url: 'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000013707&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
//   },
//   {
//     name: '求是楼南侧',
//     url: 'http://wx.99cda.com/cda-wx/chargingBike.do?q=0400000000013985&qType=device&openId=ozCzC0p1m5Tm_BUHr_pQDS5HZCw8',
//   },
// ]

function Onboarding() {
  return (
    <div className="mt-8">
      <div className="opacity-80 mb-4">尚未添加充电站二维码链接...</div>
      <Link href="/settings">
        <button className="flex items-center font-bold">
          点击设置
          <span className="icon-[iconoir--arrow-right] w-4 h-4 ml-2" />
        </button>
      </Link>
    </div>
  )
}

export default function Home() {
  const [stations, _] = useLocalStorageState<StationData[]>('stations', {
    defaultValue: [],
  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Image
        alt="Electric bike charging station (Header)"
        src={evHeaderImg}
        placeholder="blur"
        className="w-full absolute top-0 left-0 right-0 -z-10 object-cover object-bottom h-[16.5rem]"
      />
      <div className="mt-32 px-4 min-w-[20rem]">
        <div className="mb-8 relative inline-block">
          <span className="icon-[iconoir--ev-plug-charging] w-8 h-8"></span>
          <div className="absolute bottom-0.5 -right-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {stations.length === 0 ? (
            <Onboarding />
          ) : (
            stations.map((station, idx) => {
              const parsed = safeParse(StationSchema, station)
              if (parsed.success) {
                return (
                  <Channel
                    key={idx}
                    name={parsed.output.name}
                    station={parsed.output.url}
                  />
                )
              } else {
                return (
                  <div key={idx}>
                    {parsed.issues.map((issue, idx) => (
                      <span key={idx}>{issue.message}</span>
                    ))}
                  </div>
                )
              }
            })
          )}
        </div>
      </div>
      <footer className="flex w-full px-4 justify-between text-xs mt-12 mb-4">
        <div className="inline-flex items-center border-b-2">
          <Link href="/settings">修改设置</Link>
          <span className="icon-[iconoir--arrow-right] w-3 h-3 ml-1"></span>
        </div>
        <div>Made with ❤️ SpencerWoo</div>
      </footer>
    </main>
  )
}
