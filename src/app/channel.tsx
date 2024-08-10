'use client'

import useSWR from 'swr'
import { ChannelDetails, ChannelMap } from './types'
import { Dispatch, SetStateAction } from 'react'

async function fetcher(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error)
  }
  return res.json()
}

export default function Channel({
  name,
  station,
  setIsChannelMapModelOpen,
  setChannelMap,
  setChannelModalTitle,
}: {
  name: string
  station: string
  setIsChannelMapModelOpen: Dispatch<SetStateAction<boolean>>
  setChannelMap: Dispatch<SetStateAction<Partial<ChannelMap>>>
  setChannelModalTitle: Dispatch<SetStateAction<string>>
}) {
  const channelUrl = `/api?station=${encodeURIComponent(station)}`

  const { data, error, isLoading, isValidating, mutate } = useSWR<ChannelDetails>(
    channelUrl,
    fetcher,
    { refreshInterval: 1000 * 30 }
  )

  if (isLoading) {
    return (
      <div className="w-[21.375rem] h-[12rem] py-2">
        <a
          className="text-lg font-medium underline flex items-center"
          href={station}
          target="_blank"
          rel="noopener"
        >
          {name}
          <span className="icon-[iconoir--open-new-window] w-4 h-4 ml-2"></span>
        </a>
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
        <a
          className="text-lg font-medium underline flex items-center"
          href={station}
          target="_blank"
          rel="noopener"
        >
          {name}
          <span className="icon-[iconoir--open-new-window] w-4 h-4 ml-2"></span>
        </a>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm opacity-60">{name}</span>
            <span className="icon-[iconoir--pin-alt] w-3.5 h-3.5 ml-1"></span>
          </div>
          <button
            className={`icon-[iconoir--refresh-double] w-3 h-3 ml-1 ${
              isValidating && 'animate-spin'
            }`}
            onClick={() => mutate()}
          ></button>
        </div>
        <div className="text-sm text-red-500 mt-2">Error: {errorMessage}</div>
      </div>
    )
  }

  const channelMap = data.channelMap
  const deviceName = data.deviceName

  const statusMap = {
    D: ['未启用', 'border-gray-300'],
    E: ['启动', 'border-green-300'],
    I: ['空闲', 'border-emerald-400 bg-emerald-400/20'],
    C: ['充电中', 'border-amber-400'],
    P: ['启动中', 'border-blue-300 bg-blue-300/30'],
  }

  function handleChannelMapModalOpen(
    clickedChannelMap: Partial<ChannelMap>,
    clickedChannelMapTitle: string
  ) {
    setChannelMap(clickedChannelMap)
    setChannelModalTitle(clickedChannelMapTitle)
    setIsChannelMapModelOpen(true)
  }

  return (
    <div className="p-2 -mx-2">
      <a
        className="text-lg font-medium underline flex items-center"
        href={station}
        target="_blank"
        rel="noopener"
      >
        {name}
        <span className="icon-[iconoir--open-new-window] w-4 h-4 ml-2"></span>
      </a>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm opacity-60">{deviceName}</span>
          <span className="icon-[iconoir--pin-alt] w-3.5 h-3.5 ml-1"></span>
        </div>
        <button
          className={`icon-[iconoir--refresh-double] w-3 h-3 ml-1 ${
            isValidating && 'animate-spin'
          }`}
          onClick={() => mutate()}
        ></button>
      </div>
      <ul className="grid grid-cols-5 mt-2 gap-2">
        {Object.keys(channelMap).map((key) => (
          <li
            key={key}
            className={`relative cursor-pointer border-y-2 p-2 pr-3 ${statusMap[channelMap[key].channelStatus][1]}`}
            onClick={() =>
              handleChannelMapModalOpen(channelMap[key], `${name} - #${key}`)
            }
          >
            {channelMap[key].channelStatus === 'C' && (
              <span
                className="absolute left-0 bottom-0 right-0 bg-amber-300/30 -z-10"
                style={{
                  top: (1 - channelMap[key].chargedTime / (9 * 60)) * 100 + '%',
                }}
              />
            )}
            <div className="text-xs">{key}</div>
            <div className="text-sm">{statusMap[channelMap[key].channelStatus][0]}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
