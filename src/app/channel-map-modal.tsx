import { Dialog } from '@headlessui/react'
import { Dispatch, SetStateAction } from 'react'

import { ChannelMap } from '@/app/types'
import LayoutModal from './settings/layout-modal'

function ChannelMapItem({
  title,
  value,
  iconClass,
}: {
  title: string
  value: string | number | undefined
  iconClass?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
        <span className={`${iconClass} w-4 h-4 mr-2`}></span>
        <span>{title}</span>
      </div>
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

  const statusMap: Record<string, [string, string]> = {
    D: ['未启用', 'border-gray-500'],
    E: ['启动', 'border-green-500'],
    I: ['空闲', 'border-emerald-500'],
    C: ['充电中', 'border-amber-500'],
    P: ['启动中', 'border-blue-500'],
  }
  const borderClass = statusMap[channelMap.channelStatus ?? 'D']?.[1] ?? 'border-gray-300'

  function formatChannelStatus(status: string | undefined): string {
    if (status === undefined) return '未知'
    return statusMap[status]?.[0] ?? '未知'
  }

  function formatTime(minutes: number | undefined) {
    if (minutes === undefined) return '0 时 0 分'
    const hours = Math.floor(minutes / 60)
    const mins = Math.floor(minutes % 60)
    return `${hours} 小时 ${mins} 分`
  }

  return (
    <LayoutModal isOpen={isOpen} closeModal={closeModal}>
      <Dialog.Panel
        className={`relative w-full max-w-sm transform rounded-xl border-2 bg-white dark:bg-neutral-700 dark:text-white p-6 text-left align-middle shadow-xl transition-all ${borderClass}`}
      >
        <Dialog.Title
          as="h3"
          className="flex items-center text-lg font-bold leading-6 text-neutral-900 dark:text-white"
        >
          <span className="icon-[iconoir--ev-station] w-5 h-5 mr-2"></span>
          <span>充电桩详情</span>
        </Dialog.Title>

        <button
          onClick={closeModal}
          className="absolute top-6 right-6 icon-[iconoir--xmark-circle] w-6 h-6 bg-neutral-500"
        ></button>

        <div className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          {channelModalTitle}
        </div>

        <hr className="border-neutral-300 dark:border-neutral-200 mt-4" />

        {channelMap.channelStatus === 'C' && (
          <div className="relative mt-4 flex flex-col justify-center border-2 border-amber-500/30 px-4 h-16">
            <div>
              当前充电进度为 {(((channelMap.chargedTime ?? 0) / (9 * 60)) * 100).toFixed(2)}%
            </div>
            <div className="flex items-center text-sm mt-1 text-neutral-500 dark:text-neutral-400">
              <span className="icon-[iconoir--warning-circle] w-4 h-4 mr-2 flex-shrink-0"></span>
              假设充电总时长为 9 小时。
            </div>
            <span
              className="absolute top-0 bottom-0 left-0 -z-10 overflow-hidden"
              style={{
                right: `${(1 - (channelMap.chargedTime ?? 0) / (9 * 60)) * 100}%`,
                backgroundImage:
                  'repeating-linear-gradient(45deg, rgba(255, 191, 0, 0.05) 4rem, rgba(255, 191, 0, 0.1) 5rem, rgba(255, 191, 0, 0.2) 6rem, transparent 4rem, transparent 6.83rem)',
                backgroundSize: '12rem 4rem',
                animation: 'moveBackground 16s linear infinite',
              }}
            />
          </div>
        )}

        <div className="mt-6 space-y-4">
          {channelMap ? (
            <>
              <ChannelMapItem
                title="充电状态"
                value={formatChannelStatus(channelMap.channelStatus)}
                iconClass="icon-[iconoir--battery-charging]"
              />
              <ChannelMapItem
                title="充电时间"
                value={formatTime(channelMap.chargedTime)}
                iconClass="icon-[iconoir--timer]"
              />
              {/* <ChannelMapItem title="充电电量" value={`${channelMap.chargedQuantity} 度`} />
              <ChannelMapItem title="电流" value={`${channelMap.chargeI} A`} />
              <ChannelMapItem title="电压" value={`${channelMap.chargeU} V`} />
              <ChannelMapItem title="支付金额" value={`${channelMap.payAmount} 元`} /> */}
              <ChannelMapItem
                title="用户 ID"
                value={channelMap.userId}
                iconClass="icon-[iconoir--user]"
              />
              <ChannelMapItem
                title="结果码"
                value={channelMap.resultCode}
                iconClass="icon-[iconoir--info-circle]"
              />
              <ChannelMapItem
                title="结果信息"
                value={channelMap.resultMsg}
                iconClass="icon-[iconoir--dash-flag]"
              />
              <ChannelMapItem
                title="开始充电时间"
                value={new Date(channelMap.startChargeTime || 0).toLocaleString()}
                iconClass="icon-[iconoir--calendar]"
              />
            </>
          ) : (
            <div className="text-center mt-12 mb-8 text-lg text-red-500">充电桩详情解析失败</div>
          )}
        </div>
      </Dialog.Panel>
    </LayoutModal>
  )
}
