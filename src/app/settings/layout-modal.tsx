import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

/**
 * Modal parent.
 * @param isOpen - A boolean indicating whether the modal is open or not.
 * @param closeModal - A function to close the modal.
 * @param children - The content to be displayed inside the modal.
 * @returns A React component representing the layout modal.
 */
export default function LayoutModal({
  isOpen,
  closeModal,
  children,
}: {
  isOpen: boolean
  closeModal: () => void
  children: React.ReactNode
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {children}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
