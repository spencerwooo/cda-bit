'use client'

import useLocalStorageState from 'use-local-storage-state'

import { StationData } from '@/app/types'
import Link from 'next/link'
import { useState } from 'react'
import StationEditModal from './modal'

export default function Settings() {
  const [stations, setStations] = useLocalStorageState<StationData[]>(
    'stations',
    {
      defaultValue: [],
    }
  )
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingStationIdx, setEditingStationIdx] = useState(-1)

  function openNewStationModal() {
    setEditingStationIdx(-1)
    setModalOpen(true)
  }

  function openStationEditModal(idx: number) {
    setEditingStationIdx(idx)
    setModalOpen(true)
  }

  return (
    <main className="flex w-full p-4 min-h-screen flex-col items-center justify-between">
      <StationEditModal
        openState={[isModalOpen, setModalOpen]}
        stationsState={[stations, setStations]}
        stationEditIdx={editingStationIdx}
      />

      <div className="flex w-full items-center justify-between">
        <Link href="/" className="icon-[iconoir--arrow-left] w-5 h-5" />
        <div className="font-bold">配置充电站列表</div>
      </div>

      <div className="w-full text-center flex-1 mt-4">
        {stations.length > 0 ? (
          <ul className="border-b-2 border-blue-200">
            {stations.map((station, idx) => (
              <li
                key={idx}
                className="relative border-t-2 border-blue-200 px-2 py-4 text-left hover:cursor-pointer hover:bg-blue-200/20"
                onClick={() => openStationEditModal(idx)}
              >
                <span className="absolute bottom-0 right-0 text-6xl font-black opacity-10 font-mono">
                  {idx + 1}
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{station.name}</span>
                  <span className="icon-[iconoir--edit] w-4 h-4" />
                </div>
                <div className="text-xs mt-1 opacity-80 overflow-scroll">
                  {station.url}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>...</div>
        )}
        <button
          type="button"
          className="mt-4 text-center rounded-md border border-transparent bg-blue-100 px-8 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          onClick={openNewStationModal}
        >
          添加新充电站
        </button>
      </div>

      <footer className="text-xs text-center mt-12 mb-4">
        配置文件安全存储于本地浏览器中
      </footer>
    </main>
  )
}
