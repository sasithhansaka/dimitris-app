import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { forwardRef, InputHTMLAttributes, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function SearchInput(
    {
        className = "",
        isFocused = false,
        resetSearch,
        loading,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & {
        loading: boolean;
        isFocused?: boolean;
        resetSearch: () => void;
    },
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <div className="relative">
            {/* Search Container */}
            <div className="flex rounded-xl shadow-sm border border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:shadow-md focus-within:shadow-lg focus-within:ring-2 focus-within:ring-[#007A7A]/20 focus-within:border-[#1f1f1f] mt-0 lg:mt-6">
                {/* Input Section */}
                <div className="relative flex flex-grow items-stretch">
                    {/* Search Icon */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        {!loading && (
                            <MagnifyingGlassIcon
                                className="h-5 w-5 text-gray-400 transition-colors duration-200"
                                aria-hidden="true"
                            />
                        )}
                        {loading && (
                            <div className="relative">
                                <svg
                                    aria-hidden="true"
                                    className="w-5 h-5 text-gray-200 animate-spin"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="#007A7A"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Input Field */}
                    <input
                        {...props}
                        ref={localRef}
                        className={`
                            block w-full border-0 bg-transparent py-3.5 pl-12 pr-4
                            text-gray-900 placeholder:text-gray-400
                            focus:ring-0 focus:outline-none
                            text-sm
                            ${className}
                        `}
                    />
                </div>

                {/* Clear Button */}
                <button
                    type="button"
                    onClick={resetSearch}
                    className="
                        relative flex items-center justify-center px-4 py-2
                        text-gray-400 hover:text-gray-600 hover:bg-gray-50
                        transition-all duration-200
                        focus:outline-none focus:text-[#070707]
                        group
                    "
                    title="Clear search"
                >
                    <XMarkIcon
                        className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                        aria-hidden="true"
                    />
                </button>
            </div>

            {/* Loading Indicator Bar */}
            {loading && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 overflow-hidden rounded-b-xl">
                    <div className="h-full bg-gradient-to-r from-[#5d5e5e] to-[#171717] animate-pulse"></div>
                </div>
            )}
        </div>
    );
});
