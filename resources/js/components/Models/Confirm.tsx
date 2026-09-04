import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from 'lucide-react';
import { Fragment, ReactNode } from 'react';

interface ConfirmProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
    isProcessing?: boolean;
    variant?: 'danger' | 'primary' | 'success';
    showCancelButton?: boolean;
}

export default function Confirm({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmColor = '#007A7A',
    isProcessing = false,
    variant = 'primary',
    showCancelButton = true,
}: ConfirmProps) {
    // Determine button colors based on variant
    const getButtonColors = () => {
        switch (variant) {
            case 'danger':
                return {
                    confirm: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    confirmText: 'text-white',
                };
            case 'success':
                return {
                    confirm:
                        'bg-[#007A7A] hover:bg-[#006666] focus:ring-[#006666]',
                    confirmText: 'text-white',
                };
            case 'primary':
            default:
                return {
                    confirm:
                        'bg-[#007A7A] hover:bg-[#006666] focus:ring-[#006666]',
                    confirmText: 'text-white',
                };
        }
    };

    const buttonColors = getButtonColors();

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="bg-opacity-50 fixed inset-0 bg-[#373737]/70" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="mb-4 flex items-center justify-between">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg leading-6 font-semibold text-gray-900"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    <button
                                        onClick={onClose}
                                        className="rounded-full p-1.5 cursor-pointer text-gray-400 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-600"
                                        disabled={isProcessing}
                                    >
                                        <XIcon className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Message */}
                                <div className="mb-6">
                                    <div className="text-sm text-gray-600">
                                        {message}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col justify-end gap-3 sm:flex-row sm:gap-2">
                                    {showCancelButton && (
                                        <button
                                            type="button"
                                            className={`inline-flex items-center cursor-pointer justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 focus:ring-2 focus:ring-[#3c3d3d] focus:ring-offset-2 focus:outline-none ${
                                                isProcessing
                                                    ? 'cursor-not-allowed opacity-50'
                                                    : ''
                                            }`}
                                            onClick={onClose}
                                            disabled={isProcessing}
                                        >
                                            {cancelText}
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className={`inline-flex items-center cursor-pointer justify-center px-4 py-2 text-sm font-medium ${buttonColors.confirmText} rounded-lg border border-transparent bg-primary transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                                            isProcessing
                                                ? 'cursor-not-allowed opacity-50'
                                                : ''
                                        }`}
                                        onClick={onConfirm}
                                        disabled={isProcessing}
                                        style={{
                                            backgroundColor:
                                                variant === 'primary'
                                                    ? confirmColor
                                                    : undefined,
                                        }}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <svg
                                                    className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Processing...
                                            </>
                                        ) : (
                                            confirmText
                                        )}
                                    </button>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#007A7A]/20 to-transparent"></div>
                                <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-[#007A7A]/10 to-transparent"></div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
