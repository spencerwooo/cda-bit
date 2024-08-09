'use client'

import Image from 'next/image'
import Link from 'next/link'

import useLocalStorageState from 'use-local-storage-state'
import { safeParse } from 'valibot'

import Channel from '@/app/channel'
import { ChannelMap, StationData, StationSchema } from '@/app/types'
import evHeaderImg from '@/app/header.png'
import ChannelMapModal from './channel-map-modal'
import { useState } from 'react'

function Onboarding() {
  return (
    <div className="mt-8">
      <div className="opacity-80 mb-4">尚未添加充电站二维码链接...</div>
      <Link href="/settings">
        <button className="mt-4 -ml-1 flex items-center text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-200 font-bold rounded-lg px-4 py-2.5 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700">
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

  const [isChannelMapModelOpen, setIsChannelMapModelOpen] = useState(false)

  const [channelMap, setChannelMap] = useState<Partial<ChannelMap>>({})
  const [channelModalTitle, setChannelModalTitle] = useState('')

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ChannelMapModal
        openState={[isChannelMapModelOpen, setIsChannelMapModelOpen]}
        channelMap={channelMap}
        channelModalTitle={channelModalTitle}
      />

      <Image
        alt="Electric bike charging station (Header)"
        src={evHeaderImg}
        placeholder="blur"
        className="w-full h-[18rem] md:w-[32rem] absolute top-0 right-0 -z-10 object-cover object-bottom"
      />

      <div className="mt-32 px-4 min-w-[20rem]">
        <div className="mb-8 relative inline-block">
          <span className="icon-[iconoir--ev-plug] w-9 h-9"></span>
          {/* <span className="icon-[iconoir--flash] w-5 h-5 bg-lime-500 animate-pulse absolute bottom-0 -right-1"></span> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 36"
            className="absolute bottom-0 -right-1 w-5 h-5 animate-pulse stroke-lime-500 fill-lime-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M13 10V3L5 14h6v7l8-11h-6Z"
            />
          </svg>
        </div>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
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
                    setIsChannelMapModelOpen={setIsChannelMapModelOpen}
                    setChannelMap={setChannelMap}
                    setChannelModalTitle={setChannelModalTitle}
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

      <div className="mt-8">
        {stations.length > 0 && (
          <Link href="/settings">
            <button className="mt-4 flex items-center text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-200 font-medium rounded-lg px-8 py-2.5 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700">
              配置充电站列表
              <span className="icon-[iconoir--arrow-right] w-4 h-4 ml-2" />
            </button>
          </Link>
        )}
        <footer className="text-center text-xs mt-8 mb-4 opacity-80">
          Made with ❤️ SpencerWoo
        </footer>
      </div>
    </main>
  )
}
