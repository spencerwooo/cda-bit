import { Dispatch, SetStateAction } from 'react'
import { Dialog } from '@headlessui/react'

import { StationData } from '@/app/types'
import LayoutModal from './layout-modal'

export default function StationDeleteConfirmModal({
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

  function handleDelete() {
    if (stationEditIdx >= 0) {
      const newStations = stations.filter((_, idx) => idx !== stationEditIdx)
      setStations(newStations)
      closeModal()
    }
  }

  return (
    <LayoutModal isOpen={isOpen} closeModal={closeModal}>
      <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-neutral-700 dark:text-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="flex items-center text-lg font-bold leading-6 text-red-700 dark:text-red-400"
        >
          <span className="icon-[iconoir--warning-triangle] w-5 h-5 mr-2"></span>
          <span>确认删除本充电站？</span>
        </Dialog.Title>

        <div className="mt-4">
          <div className="flex items-center mb-1 text-sm font-bold text-neutral-900 dark:text-white">
            <span className="icon-[iconoir--ev-tag] w-4 h-4 mr-2"></span>
            <span>名称</span>
          </div>
          <div className="truncate">{stations[stationEditIdx]?.name}</div>
        </div>
        <div className="mt-4">
          <div className="flex items-center mb-1 text-sm font-bold text-neutral-900 dark:text-white">
            <span className="icon-[iconoir--arrow-tr-square] w-4 h-4 mr-2"></span>
            <span>二维码链接</span>
          </div>
          <div className="overflow-scroll">
            <a
              className="underline"
              href={stations[stationEditIdx]?.url}
              target="_blank"
              rel="noopener"
            >
              {stations[stationEditIdx]?.url}
            </a>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="w-full text-center mt-4 rounded-md font-medium py-2 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800"
        >
          确认删除
        </button>
      </Dialog.Panel>
    </LayoutModal>
  )
}
