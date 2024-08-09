import { Dialog } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'

import { ChannelMap } from '@/app/types'
import LayoutModal from './settings/layout-modal'

function ChannelMapItem({ title, value }: { title: string; value: string | number | undefined }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-neutral-500 dark:text-neutral-400">{title}</div>
      <div className="text-sm">{value}</div>
    </div>
  )
}

export default function ChannelMapModal({
  openState,
  channelMap,
  channelModalTitle,
}: {
  openState: [boolean, Dispatch<SetStateAction<boolean>>]
  channelMap: Partial<ChannelMap>
  channelModalTitle: string
}) {
  const [isOpen, setIsOpen] = openState

  function closeModal() {
    setIsOpen(false)
  }

  const statusMap = {
    D: ['未启用', 'border-gray-300'],
    E: ['启动', 'border-green-300'],
    I: ['空闲', 'border-emerald-400'],
    C: ['充电中', 'border-amber-400'],
    P: ['启动中', 'border-blue-300'],
  }

  return (
    <LayoutModal isOpen={isOpen} closeModal={closeModal}>
      <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-xl bg-white dark:bg-neutral-700 dark:text-white p-6 text-left align-middle shadow-xl transition-all">
        <Dialog.Title
          as="h3"
          className="flex items-center text-lg font-bold leading-6 text-neutral-900 dark:text-white"
        >
          <span className="icon-[iconoir--ev-station] w-5 h-5 mr-2"></span>
          <span>充电桩详情</span>
        </Dialog.Title>

        <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          {channelModalTitle}
        </div>

        <div
          className={`mt-4 border-2 p-4 space-y-4 ${statusMap[channelMap.channelStatus || 'D'][1]}`}
        >
          {channelMap ? (
            <>
              <ChannelMapItem title="状态" value={statusMap[channelMap.channelStatus || 'D'][0]} />
              <ChannelMapItem title="充电时间" value={`${channelMap.chargedTime} 秒`} />
              <ChannelMapItem title="充电电量" value={`${channelMap.chargedQuantity} 度`} />
              <ChannelMapItem title="电流" value={`${channelMap.chargeI} A`} />
              <ChannelMapItem title="电压" value={`${channelMap.chargeU} V`} />
              <ChannelMapItem title="支付金额" value={`${channelMap.payAmount} 元`} />
              <ChannelMapItem title="用户 ID" value={channelMap.userId} />
              <ChannelMapItem title="结果码" value={channelMap.resultCode} />
              <ChannelMapItem title="结果信息" value={channelMap.resultMsg} />
              <ChannelMapItem
                title="开始充电时间"
                value={new Date(channelMap.startChargeTime || 0).toLocaleString()}
              />
            </>
          ) : (
            <div>null</div>
          )}
        </div>
      </Dialog.Panel>
    </LayoutModal>
  )
}
