'use client'

import { Dispatch, SetStateAction } from 'react'
import { Dialog } from '@headlessui/react'
import { ValiError, parse } from 'valibot'
import toast from 'react-hot-toast'

import { StationData, StationSchema } from '@/app/types'
import LayoutModal from './layout-modal'

export default function StationEditModal({
  openState,
  stationsState,
  stationEditIdx,
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  stationsState: [StationData[], Dispatch<SetStateAction<StationData[]>>]
  stationEditIdx: number
}) {
  const [isOpen, setIsOpen] = openState
  const [stations, setStations] = stationsState

  function closeModal() {
    setIsOpen(false)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // validate station data
    try {
      const stationData = Object.fromEntries(formData.entries())
      const editedStation = parse(StationSchema, stationData)

      if (stationEditIdx >= 0) {
        // edit station at index
        const newStations = stations.map((station, idx) =>
          idx === stationEditIdx ? editedStation : station
        )
        setStations(newStations)
      } else {
        // check for duplicated station based on url
        if (stations.some(station => station.url === editedStation.url)) {
          throw new Error('该充电站已存在')
        }
        // add new station
        const newStations = [...stations, editedStation]
        setStations(newStations)
      }

      closeModal()
    } catch (error) {
      if (error instanceof ValiError || error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  return (
    <LayoutModal isOpen={isOpen} closeModal={closeModal}>
      <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-xl bg-white dark:bg-neutral-600 dark:text-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="text-lg font-bold leading-6 text-neutral-900 dark:text-white"
        >
          {stationEditIdx >= 0 ? '修改' : '添加新的'}充电站
        </Dialog.Title>

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="flex items-center mb-1 text-sm font-bold text-neutral-900 dark:text-white">
              <span className="icon-[iconoir--ev-tag] w-4 h-4 mr-2"></span>
              <span>名称（昵称）</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="研究生公寓楼下"
              defaultValue={
                stationEditIdx >= 0 ? stations[stationEditIdx]?.name : ''
              }
              className="bg-neutral-50 border border-neutral-300 text-neutral-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="flex items-center mb-1 text-sm font-bold text-neutral-900 dark:text-white">
              <span className="icon-[iconoir--qr-code] w-4 h-4 mr-2"></span>
              <span>二维码链接（使用微信扫码后复制链接）</span>
            </label>
            <input
              type="url"
              name="url"
              placeholder="http://wx.99cda.com/cda-wx/chargingBike.do?q=..."
              defaultValue={
                stationEditIdx >= 0 ? stations[stationEditIdx]?.url : ''
              }
              className="bg-neutral-50 border border-neutral-300 text-neutral-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-neutral-800 dark:border-neutral-600 dark:placeholder-neutral-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full text-center mt-4 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg py-2"
          >
            保存
          </button>
        </form>
      </Dialog.Panel>
    </LayoutModal>
  )
}
