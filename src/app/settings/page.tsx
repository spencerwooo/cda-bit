'use client'

import useLocalStorageState from 'use-local-storage-state'

import { StationData } from '@/app/types'
import Link from 'next/link'
import { useState } from 'react'
import StationEditModal from './edit-modal'
import StationDeleteConfirmModal from './confirm-delete-modal'

export default function Settings() {
  const [stations, setStations] = useLocalStorageState<StationData[]>(
    'stations',
    {
      defaultValue: [],
    }
  )
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [targetStationIdx, setTargetStationIdx] = useState(-1)

  function openNewStationModal() {
    setTargetStationIdx(-1)
    setEditModalOpen(true)
  }

  function openStationEditModal(idx: number) {
    setTargetStationIdx(idx)
    setEditModalOpen(true)
  }

  function openStationDeleteConfirmModal(idx: number) {
    setTargetStationIdx(idx)
    setDeleteModalOpen(true)
  }

  return (
    <main className="flex w-full min-h-screen flex-col items-center justify-between">
      <StationEditModal
        openState={[isEditModalOpen, setEditModalOpen]}
        stationsState={[stations, setStations]}
        stationEditIdx={targetStationIdx}
      />

      <StationDeleteConfirmModal
        openState={[isDeleteModalOpen, setDeleteModalOpen]}
        stationsState={[stations, setStations]}
        stationEditIdx={targetStationIdx}
      />

      <div className="flex w-full items-center justify-between p-4">
        <Link
          href="/"
          className="flex items-center text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-200 font-medium rounded-lg text-sm px-4 py-2 mr-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700"
        >
          <span className="icon-[iconoir--arrow-left] w-4 h-4"></span>
          <span className="font-medium ml-2">返回</span>
        </Link>
        <div className="font-bold">配置充电站列表</div>
      </div>

      <div className="w-full text-center flex-1">
        {stations.length > 0 ? (
          <ul className="border-b dark:border-neutral-700">
            {stations.map((station, idx) => (
              <li
                key={idx}
                className="flex items-center relative border-t dark:border-neutral-700 px-4 text-left hover:cursor-pointer hover:bg-neutral-200/20 overflow-hidden"
              >
                <span className="absolute -bottom-5 -right-4 text-8xl font-black opacity-10 font-mono rotate-12 -z-10">
                  {idx + 1}
                </span>

                <button className="icon-[iconoir--menu] w-5 h-5 flex-shrink-0 mr-4" />

                <div
                  className="overflow-hidden mr-4 flex-1 py-3"
                  onClick={() => openStationEditModal(idx)}
                >
                  <div className="flex items-center">
                    <span className="font-bold mr-2 truncate">
                      {station.name}
                    </span>
                    <span className="icon-[iconoir--edit-pencil] w-4 h-4" />
                  </div>
                  <div className="text-xs mt-1 opacity-80 overflow-scroll">
                    {station.url}
                  </div>
                </div>

                <button
                  className="p-3 pt-4 rounded-lg text-white bg-gradient-to-br from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
                  onClick={() => openStationDeleteConfirmModal(idx)}
                >
                  <span className="icon-[iconoir--trash] w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div>...</div>
        )}
      </div>

      <button
        type="button"
        className="mt-4 mx-auto flex items-center rounded-md px-8 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 fixed bottom-16 z-10"
        onClick={openNewStationModal}
      >
        <span className="mr-2">添加新充电站</span>
        <span className="icon-[iconoir--add-circle] w-5 h-5"></span>
      </button>

      <footer className="flex items-center text-xs mt-8 mb-4">
        <span className="icon-[iconoir--warning-hexagon] w-3 h-3 mr-1"></span>
        <span>配置文件安全存放于浏览器本地存储中</span>
      </footer>
    </main>
  )
}
