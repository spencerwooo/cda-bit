import {
  useSortable,
  defaultAnimateLayoutChanges,
  AnimateLayoutChanges,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { forwardRef } from 'react'

import { StationData } from '../types'

// eslint-disable-next-line react/display-name
export const RefStationItem = forwardRef<
  HTMLDivElement,
  { id: string; stations: StationData[] }
>(({ id, stations, ...props }, ref) => {
  const station = stations.find(station => station.url === id)
  return (
    <div {...props} ref={ref as React.Ref<HTMLDivElement>}>
      <SortableStationItem
        id={id}
        idx={-1}
        station={station!}
        openStationEditModal={() => {}}
        openStationDeleteConfirmModal={() => {}}
      />
    </div>
  )
})

export default function SortableStationItem({
  id,
  idx,
  station,
  openStationEditModal,
  openStationDeleteConfirmModal,
}: {
  id: string
  idx: number
  station: StationData
  openStationEditModal: (idx: number) => void
  openStationDeleteConfirmModal: (idx: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      className="flex items-center touch-manipulation relative border-t dark:border-neutral-700 pl-2 pr-4 text-left overflow-hidden hover:cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <span className="absolute -bottom-5 -right-4 text-8xl font-black opacity-10 font-mono rotate-12 -z-10">
        {idx + 1}
      </span>

      <button
        ref={setActivatorNodeRef}
        className="p-2 pt-3 flex-shrink-0 rounded-lg hover:cursor-move focus:outline-none hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-200 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700"
        {...listeners}
      >
        <span className="icon-[iconoir--menu] w-5 h-5"></span>
      </button>

      <div
        className="overflow-hidden px-2 flex-1 py-3"
        onClick={() => openStationEditModal(idx)}
      >
        <div className="flex items-center">
          <span className="font-bold mr-2 truncate">{station.name}</span>
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
  )
}
