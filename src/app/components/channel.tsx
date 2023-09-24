'use client'
import useSWR from 'swr'
import { ChannelDetails } from '../types'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function Channel({
  name,
  station,
}: {
  name: string
  station: string
}) {
  const channelUrl = `/api?station=${encodeURIComponent(station)}`

  const { data, error, isLoading, isValidating } = useSWR<ChannelDetails>(
    channelUrl,
    fetcher,
    { refreshInterval: 1000 * 30 }
  )

  if (isLoading) {
    return (
      <div className="w-[21.375rem] h-[12rem] py-2">
        <div className="font-bold">{name}</div>
        <div className="text-sm opacity-60 bg-gray-300 dark:bg-neutral-700 h-4 rounded-md mt-2 animate-pulse"></div>
        <ul className="grid grid-cols-5 mt-2 gap-2 animate-pulse">
          {[...Array(10)].map((_, index) => (
            <li
              key={index}
              className="relative w-[3.875rem] h-[3.5rem] bg-gray-300 dark:bg-neutral-700 rounded-md"
            ></li>
          ))}
        </ul>
      </div>
    )
  }

  if (!data) {
    const errorMessage = error?.message || 'Unknown error.'
    return (
      <div className="w-[21.375rem] h-[12rem] py-2">
        <div className="font-bold">{name}</div>
        <div className="text-sm text-red-500 mt-2">Error: {errorMessage}</div>
      </div>
    )
  }

  const channelMap = data.channelMap
  const deviceName = data.deviceName

  const statusMap = {
    D: ['未启用', 'border-gray-300'],
    E: ['启动', 'border-green-300'],
    I: ['空闲', 'border-green-400 bg-green-400/20'],
    C: ['充电中', 'border-yellow-400'],
    P: ['启动中', 'border-blue-300 bg-blue-300/20'],
  }

  return (
    <div className="py-2">
      <div className="font-bold">{name}</div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm opacity-60">{deviceName}</span>
          <span className="icon-[iconoir--pin-alt] w-4 h-4 ml-1"></span>
        </div>
        {isValidating ? (
          <span className="icon-[iconoir--refresh-double] w-3 h-3 ml-1 animate-spin"></span>
        ) : null}
      </div>
      <ul className="grid grid-cols-5 mt-2 gap-2">
        {Object.keys(channelMap).map(key => (
          <li
            key={key}
            className={`relative border-y-2 p-2 pr-3 ${
              statusMap[channelMap[key].channelStatus][1]
            }`}
          >
            {channelMap[key].channelStatus === 'C' && (
              <span
                className="absolute left-0 bottom-0 right-0 bg-yellow-300/20 -z-10"
                style={{
                  top: (channelMap[key].chargedTime / (9 * 60)) * 100 + '%',
                }}
              />
            )}
            <div className="text-xs">{key}</div>
            <div className="text-sm">
              {statusMap[channelMap[key].channelStatus][0]}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
