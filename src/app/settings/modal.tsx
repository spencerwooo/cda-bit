'use client'

import { Dispatch, Fragment, SetStateAction } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { StationData } from '@/app/types'

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
    console.log('triggered')

    const formData = new FormData(e.currentTarget)
    const editedStation = Object.fromEntries(formData.entries()) as StationData

    if (stationEditIdx >= 0) {
      // edit station at index
      const newStations = stations.map((station, idx) =>
        idx === stationEditIdx ? editedStation : station
      )
      setStations(newStations)
    } else {
      // add new station
      const newStations = [...stations, editedStation]
      setStations(newStations)
    }
    closeModal()
  }

  // const [deleteConfirmed, setDeleteConfirmed] = useState(false)
  // function handleDeleteConfirm() {
  //   setDeleteConfirmed(true)
  // }
  function handleDelete() {
    if (stationEditIdx >= 0) {
      // delete station at index
      console.log('delete station at index', stationEditIdx)
      const newStations = stations.filter((_, idx) => idx !== stationEditIdx)
      console.log('newStations', newStations)
      // setStations(newStations)
      closeModal()
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-gray-900"
                >
                  {stationEditIdx >= 0 ? '修改' : '添加新的'}充电站
                </Dialog.Title>

                <form onSubmit={handleSubmit}>
                  <div className="mt-4">
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                      名称（昵称）
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="研究生公寓楼下"
                      defaultValue={
                        stationEditIdx >= 0
                          ? stations[stationEditIdx]?.name
                          : ''
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
                      二维码链接（使用微信扫码后复制浏览器链接）
                    </label>
                    <input
                      type="url"
                      name="url"
                      placeholder="http://wx.99cda.com/cda-wx/chargingBike.do?q=..."
                      defaultValue={
                        stationEditIdx >= 0 ? stations[stationEditIdx]?.url : ''
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div>
                  <div className="mt-4 flex space-x-3">
                    {stationEditIdx >= 0 && (
                      <button
                        onClick={handleDelete}
                        className="w-full text-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      >
                        删除
                      </button>
                    )}
                    <button
                      type="submit"
                      className="w-full text-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      保存
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
