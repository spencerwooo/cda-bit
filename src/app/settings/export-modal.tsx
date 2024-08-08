import { Dialog } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'

import { StationData } from '@/app/types'
import toast from 'react-hot-toast'
import { useCopyToClipboard } from '../use-clipboard'
import LayoutModal from './layout-modal'

export default function ExportModal({
  openState,
  stations,
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  stations: StationData[]
}) {
  const [isOpen, setIsOpen] = openState
  const [_, copy] = useCopyToClipboard()

  function closeModal() {
    setIsOpen(false)
  }

  function handleClipboardCopy() {
    copy(JSON.stringify(stations))
      .then(() => toast.success('已复制到剪贴板'))
      .catch(() => toast.error('复制失败，请手动复制'))
  }

  return (
    <LayoutModal isOpen={isOpen} closeModal={closeModal}>
      <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-neutral-700 dark:text-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="flex items-center text-lg font-bold leading-6 text-neutral-900 dark:text-white"
        >
          <span className="icon-[iconoir--database-export] w-5 h-5 mr-2"></span>
          <span>导出充电站列表配置文件</span>
        </Dialog.Title>

        <pre className="mt-4 p-4 text-sm bg-gray-100 max-h-96 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded-md overflow-auto">
          <code>{JSON.stringify(stations, null, 2)}</code>
        </pre>
        <button
          onClick={handleClipboardCopy}
          className="w-full text-center mt-4 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg py-2"
        >
          复制到剪贴板
        </button>
      </Dialog.Panel>
    </LayoutModal>
  )
}
