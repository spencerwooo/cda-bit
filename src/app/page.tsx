'use client'

import Image from 'next/image'
import Link from 'next/link'

import useLocalStorageState from 'use-local-storage-state'
import { safeParse } from 'valibot'

import Channel from '@/app/channel'
import { StationData, StationSchema } from '@/app/types'
import evHeaderImg from '@/app/header.png'

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

      <div className="mt-8">
        {stations.length > 0 && (
          <Link href="/settings">
            <button className="mt-4 flex items-center text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-200 font-medium rounded-lg text-sm px-8 py-2.5 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700">
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
