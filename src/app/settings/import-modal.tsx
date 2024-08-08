import { Dialog } from '@headlessui/react'
import { Dispatch, FormEvent, SetStateAction } from 'react'

import { StationData, StationSchema } from '@/app/types'
import toast from 'react-hot-toast'
import { parse, ValiError } from 'valibot'
import LayoutModal from './layout-modal'

export default function ImportModal({
  openState,
  stationsState,
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  stationsState: [StationData[], Dispatch<SetStateAction<StationData[]>>]
}) {
  const [isOpen, setIsOpen] = openState
  const [stations, setStations] = stationsState

  function closeModal() {
    setIsOpen(false)
  }

  function handleImport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const formJson = Object.fromEntries(formData.entries())

    try {
      const rawImportedStations = JSON.parse(formJson.importedStations.toString())
      const importedStations = rawImportedStations.map((station: StationData) =>
        parse(StationSchema, station)
      )

      // merge imported stations with existing stations
      const newlySettledStations = [
        ...stations,
        ...importedStations.filter(
          (station: StationData) => !stations.some((s) => s.url === station.url)
        ),
      ]
      setStations(newlySettledStations)
      closeModal()
      toast.success('导入成功')
    } catch (error) {
      if (error instanceof ValiError || error instanceof Error) {
        toast.error(`导入失败: ${error.message}`)
      }
    }
  }

  return (
    <LayoutModal isOpen={isOpen} closeModal={closeModal}>
      <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-neutral-700 dark:text-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="flex items-center text-lg font-bold leading-6 text-neutral-900 dark:text-white"
        >
          <span className="icon-[iconoir--import] w-5 h-5 mr-2"></span>
          <span>导入充电站列表配置文件</span>
        </Dialog.Title>

        <div
          className="flex items-center p-4 my-4 text-sm text-amber-800 border border-amber-300 rounded-lg bg-amber-50 dark:bg-gray-800 dark:text-amber-300 dark:border-amber-800"
          role="alert"
        >
          <span className="icon-[iconoir--warning-circle-solid] w-5 h-5 mr-2 flex-shrink-0"></span>
          <span className="sr-only">Warning</span>
          <div>
            <span className="font-medium">注意！</span>{' '}
            导入的配置文件将会与现有的充电站列表合并，重复的充电站将会被忽略，请确认导入的配置完整、正确后再提交。
          </div>
        </div>

        <form action="submit" onSubmit={handleImport}>
          <textarea
            name="importedStations"
            className="block p-4 font-mono text-sm break-all bg-gray-100 h-72 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-md overflow-auto w-full text-gray-900  focus:ring-amber-500 focus:border-amber-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-amber-500 dark:focus:border-amber-500"
            placeholder='[{"name":"光电楼北侧","url":"http://wx.99cda.com..."},...]'
            autoFocus
            required
          ></textarea>
          <button
            type="submit"
            className="w-full text-center mt-4 rounded-md font-medium py-2 text-white bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-amber-300 dark:focus:ring-amber-800"
          >
            导入/合并配置
          </button>
        </form>
      </Dialog.Panel>
    </LayoutModal>
  )
}
