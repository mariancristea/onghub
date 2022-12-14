import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

interface DeleteRowConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteRowConfirmationModal = ({ onClose, onConfirm }: DeleteRowConfirmationModalProps) => {
  const { t } = useTranslation(['delete_row', 'common']);
  return (
    <Transition.Root show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="sm:text-lg lg:text-xl text-md leading-6 font-bold text-gray-900"
                    >
                      {t('delete')}
                    </Dialog.Title>
                    <div className="mt-6">
                      <p className="text-base text-gray-900 font-normal">{t('information')}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 flex gap-4 sm:flex-row flex-row-reverse">
                  <button
                    type="button"
                    className="red-button sm:text-sm lg:text-base text-xs"
                    onClick={onConfirm}
                  >
                    {t('delete', { ns: 'common' })}
                  </button>
                  <button
                    type="button"
                    className="w-1/3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white sm:text-sm lg:text-base text-xs font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:w-auto"
                    onClick={onClose}
                  >
                    {t('no_delete')}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default DeleteRowConfirmationModal;
