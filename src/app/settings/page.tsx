'use client'

import { useState } from 'react'
import Link from 'next/link'
import useLocalStorageState from 'use-local-storage-state'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

import { StationData } from '@/app/types'
import StationEditModal from './edit-modal'
import StationDeleteConfirmModal from './confirm-delete-modal'
import SortableStationItem, { RefStationItem } from './sortable-station-item'
import ExportModal from './export-modal'
import ImportModal from './import-modal'

export default function Settings() {
  const [stations, setStations] = useLocalStorageState<StationData[]>('stations', {
    defaultValue: [],
  })
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isImportModalOpen, setImportModalOpen] = useState(false)
  const [isExportModalOpen, setExportModalOpen] = useState(false)
  const [targetStationIdx, setTargetStationIdx] = useState(-1)
  const [dndActiveId, setDndActiveId] = useState<string | null>(null)

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

  function openImportModal() {
    setImportModalOpen(true)
  }

  function openExportModal() {
    setExportModalOpen(true)
  }

  const sensors = useSensors(
    useSensor(TouchSensor),
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    setDndActiveId(active.id as string)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over !== null && active.id !== over.id) {
      const activeIndex = stations.findIndex((s) => s.url === active.id)
      const overIndex = stations.findIndex((s) => s.url === over.id)

      setStations((stations) => arrayMove(stations, activeIndex, overIndex))
    }
    setDndActiveId(null)
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

      <ImportModal
        openState={[isImportModalOpen, setImportModalOpen]}
        stationsState={[stations, setStations]}
      />
      <ExportModal openState={[isExportModalOpen, setExportModalOpen]} stations={stations} />

      <div className="flex w-full items-center justify-between p-4">
        <Link
          href="/"
          className="w-24 flex justify-center items-center text-neutral-900 bg-white border border-neutral-300 focus:outline-none hover:bg-neutral-100 focus:ring-4 focus:ring-neutral-200 font-medium rounded-lg text-sm px-4 py-2 mr-2 dark:bg-neutral-800 dark:text-white dark:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:border-neutral-600 dark:focus:ring-neutral-700"
        >
          <span className="icon-[iconoir--arrow-left] w-4 h-4"></span>
          <span className="font-medium ml-2">返回</span>
        </Link>
        <div className="font-bold">充电站列表</div>
        <div className="w-28" />
      </div>

      <div className="mx-auto md:max-w-xl w-full text-center flex-1">
        {stations.length > 0 ? (
          <ul className="border-b dark:border-neutral-700 md:border-none md:space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={stations.map((s) => s.url)}
                strategy={verticalListSortingStrategy}
              >
                {stations.map((station, idx) => (
                  <SortableStationItem
                    key={station.url}
                    id={station.url}
                    idx={idx}
                    station={station}
                    openStationEditModal={openStationEditModal}
                    openStationDeleteConfirmModal={openStationDeleteConfirmModal}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {dndActiveId !== null && <RefStationItem id={dndActiveId} stations={stations} />}
              </DragOverlay>
            </DndContext>
          </ul>
        ) : (
          <div className="opacity-80 text-sm">还没有添加充电站二维码链接…</div>
        )}
      </div>

      <button
        type="button"
        className="mt-4 mx-auto flex items-center rounded-md px-8 py-2.5 font-medium text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80"
        onClick={openNewStationModal}
      >
        <span className="mr-2">添加新充电站</span>
        <span className="icon-[iconoir--add-circle] w-5 h-5"></span>
      </button>

      <footer className="text-center mt-8 mb-4">
        <button className="mr-2 text-sm underline" onClick={openImportModal}>
          导入配置
        </button>
        <span>⋅</span>
        <button className="ml-2 text-sm underline" onClick={openExportModal}>
          导出配置
        </button>
        <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-200">
          <span className="icon-[iconoir--warning-hexagon] w-3 h-3 mr-1"></span>
          <span>配置文件安全存放于浏览器本地存储中</span>
        </div>
      </footer>
    </main>
  )
}
