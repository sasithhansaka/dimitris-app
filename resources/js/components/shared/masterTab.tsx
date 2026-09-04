import SearchInput from "../Elements/SearchInput";
import Pagination from "./Pagination";
import { Disclosure } from "@headlessui/react";
import { router } from "@inertiajs/react";
import React, { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export function TableBody({
    key,
    children,
    buttons,
}: {
    key: any;
    children: any;
    buttons: any;
}) {
    return (
        <Disclosure
            as="tbody"
            className="w-full bg-white transition-all duration-200"
            key={key}
        >
            {({ open }) => (
                <>
                    <tr
                        key={key + "p"}
                        className="border-b border-gray-200 transition-colors duration-150 hover:bg-gray-50/50"
                    >
                        <TableTd width={10}>
                            <Disclosure.Button></Disclosure.Button>
                        </TableTd>
                        {children}
                    </tr>
                    <tr key={key + "c"}>
                        <Disclosure.Panel
                            as="td"
                            colSpan={100}
                            className="py-6 pr-3 pl-4 transition-all duration-300 sm:pl-6"
                        >
                            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                                <span className="flex items-center space-x-4">
                                    {buttons}
                                </span>
                            </div>
                        </Disclosure.Panel>
                    </tr>
                </>
            )}
        </Disclosure>
    );
}

export function TableTd({
    children,
    width,
    className,
    allowOverflow,
}: {
    children: any;
    width?: number | string;
    className?: string;
    allowOverflow?: boolean;
}) {
    return (
        <td
            width={typeof width === "number" ? width : undefined}
            className={`border-b border-gray-200 py-4 pr-3 pl-4 text-sm font-medium text-gray-800 transition-colors duration-150 sm:pl-6 ${
                typeof width === "string" ? width : ""
            } ${className || ""}`}
            style={{
                wordWrap: "break-word",
                overflow: allowOverflow ? "visible" : "hidden",
                textOverflow: "ellipsis",
            }}
        >
            {children}
        </td>
    );
}

export default function MasterTab({
    tableColumns,
    filters,
    url,
    createLink,
    importLink,
    exportLink,
    filterBar = true,
    search,
    statusFilter,
    links,
    extraQueryParams = {},
    children,
}: {
    tableColumns: any;
    filters: any;
    url: string;
    createLink?: {
        label: string;
        url: string;
    };
    importLink?: {
        label: string;
        url: string;
    };
    exportLink?: {
        label: string;
        url: string;
    };
    search?: {
        placeholder: string;
    };
    filterBar?: boolean;
    statusFilter?: {
        options: { label: string; value: string }[];
    };
    links: any;
    extraQueryParams?: Record<string, any>;
    children: any;
}) {
    const [searchParam, setSearchParam] = useState(filters.searchParam ?? "");
    const [page, setPage] = useState(filters.page ?? 1);
    const [rowPerPage, setRowPerPage] = useState(filters.perPage ?? 10);
    const [sortBy, setSortBy] = useState(filters.sortBy ?? "name");
    const [sortDirection, setSortDirection] = useState(
        filters.sortDirection ?? "desc",
    );
    const [status, setStatus] = useState(filters.status ?? "");
    const [isSearchLoading, setIsSearchLoading] = useState(false);

    // Memoized function to make API calls
    const makeRequest = useCallback(
        (params: {
            page: number;
            rowPerPage: number;
            sortBy: string;
            sortDirection: string;
            searchParam: string;
            status: string;
        }) => {
            router.get(
                url,
                {
                    page: params.page,
                    rowPerPage: params.rowPerPage,
                    sortBy: params.sortBy,
                    sortDirection: params.sortDirection,
                    searchParam: params.searchParam,
                    status: params.status,
                    ...extraQueryParams,
                },
                {
                    replace: true,
                    preserveState: true,
                    preserveScroll: true,
                    onStart: () => {
                        setIsSearchLoading(true);
                    },
                    onFinish: () => {
                        setIsSearchLoading(false);
                    },
                },
            );
        },
        [url, extraQueryParams],
    );

    // Debounced search function
    const debouncedSearch = useDebouncedCallback((value: string) => {
        const newPage = 1; // Reset to first page when searching
        setPage(newPage);

        makeRequest({
            page: newPage,
            rowPerPage,
            sortBy,
            sortDirection,
            searchParam: value,
            status,
            ...extraQueryParams,
        });
    }, 1000);

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchParam(value);
        debouncedSearch(value);
    };

    // Reset search function
    const resetSearch = () => {
        const newSearchParam = "";
        const newPage = 1;

        setSearchParam(newSearchParam);
        setPage(newPage);

        makeRequest({
            page: newPage,
            rowPerPage,
            sortBy,
            sortDirection,
            searchParam: newSearchParam,
            status,
            ...extraQueryParams,
        });
    };

    // Handle sorting
    const handleOnSort = (column: string, direction: string) => {
        setSortBy(column);
        setSortDirection(direction);

        makeRequest({
            page,
            rowPerPage,
            sortBy: column,
            sortDirection: direction,
            searchParam,
            status,
            ...extraQueryParams,
        });
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        setPage(newPage);

        makeRequest({
            page: newPage,
            rowPerPage,
            sortBy,
            sortDirection,
            searchParam,
            status,
            ...extraQueryParams,
        });
    };

    // Handle status filter change
    const handleStatusChange = (value: string) => {
        const newPage = 1; // Reset to first page when filtering
        setStatus(value);
        setPage(newPage);

        makeRequest({
            page: newPage,
            rowPerPage,
            sortBy,
            sortDirection,
            searchParam,
            status: value,
            ...extraQueryParams,
        });
    };

    // Sync state with filters prop when it changes
    useEffect(() => {
        setSearchParam(filters.searchParam ?? "");
        setPage(filters.page ?? 1);
        setRowPerPage(filters.perPage ?? 10);
        setSortBy(filters.sortBy ?? "");
        setSortDirection(filters.sortDirection ?? "");
        setStatus(filters.status ?? "");
    }, [filters]);

    const getColumnWidth = useCallback(
        (column: any, index: number) => {
            if (column.width) {
                return column.width;
            }

            if (index === 0) {
                return 48;
            }

            if (index === tableColumns.length - 1) {
                return 112;
            }

            return undefined;
        },
        [tableColumns],
    );

    function tableTh({
        label,
        sortField,
        sortable,
        width,
    }: {
        label: string;
        sortField: string;
        sortable: boolean;
        width?: number | string;
    }) {
        const isActive = sortBy === sortField;
        const widthClass =
            typeof width === "string" && width.startsWith("w-") ? width : "";
        const widthStyle =
            typeof width === "number"
                ? { width: `${width}px` }
                : typeof width === "string" && !width.startsWith("w-")
                  ? { width }
                  : undefined;

        return (
            <th
                key={sortField}
                onClick={() =>
                    sortable &&
                    handleOnSort(
                        sortField,
                        isActive
                            ? sortDirection === "asc"
                                ? "desc"
                                : "asc"
                            : "asc",
                    )
                }
                scope="col"
                className={
                    (sortable
                        ? "cursor-pointer transition-all duration-200 "
                        : "cursor-default ") +
                    "group relative py-4 pr-3 pl-4 text-left text-sm font-normal text-black sm:pl-6" +
                    widthClass +
                    (isActive ? "" : "")
                }
                style={widthStyle}
            >
                <div className="flex items-center justify-between">
                    <span className="text-black transition-colors duration-200">
                        {label}
                    </span>
                </div>
                {sortable && isActive && (
                    <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-[#007A7A] to-transparent"></div>
                )}
            </th>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center">
                    {search && (
                        <div className="relative max-w-md flex-1">
                            <SearchInput
                                id="search"
                                className="block w-full transition-all duration-200 focus:ring-[#0d0d0d]"
                                isFocused
                                value={searchParam}
                                placeholder={search.placeholder}
                                resetSearch={resetSearch}
                                autoComplete="search"
                                loading={isSearchLoading}
                                onChange={handleSearchChange}
                            />
                        </div>
                    )}

                    {statusFilter && (
                        <Select
                            value={status || "all"}
                            onValueChange={(value) =>
                                handleStatusChange(value === "all" ? "" : value)
                            }
                        >
                            <SelectTrigger className="h-12.5 w-40 lg:w-60 lg:py-6 lg:mt-6">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                {statusFilter.options.map((option) => (
                                    <SelectItem
                                        key={option.value || "all"}
                                        value={option.value || "all"}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    {exportLink && (
                        <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-[#007A7A] hover:bg-gray-50 focus:ring-2 focus:ring-[#007A7A]/20 focus:outline-none">
                            {exportLink.label}
                        </button>
                    )}
                    {importLink && (
                        <button className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#1a1b1b] to-[#171717] px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:from-[#00aaaa] hover:to-[#1b1b1b] focus:ring-2 focus:ring-[#007A7A]/20 focus:outline-none">
                            {importLink.label}
                        </button>
                    )}
                    {/* {createLink && (
                        <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#007A7A] to-[#00aaaa] rounded-lg hover:from-[#00aaaa] hover:to-[#008888] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#007A7A]/20 shadow-lg">
                            {createLink.label}
                        </button>
                    )} */}
                </div>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white lg:min-h-[450px]">
                {/* Table Header Gradient */}
                {/* <div className="h-1 bg-gradient-to-r from-[#007A7A] via-[#00dddd] to-[#007A7A]"></div> */}

                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <table className="min-w-full table-fixed">
                            <colgroup>
                                <col style={{ width: "10px" }} />
                                {tableColumns.map(
                                    (column: any, index: number) => {
                                        const width = getColumnWidth(
                                            column,
                                            index,
                                        );
                                        const widthClass =
                                            typeof width === "string" &&
                                            width.startsWith("w-")
                                                ? width
                                                : "";
                                        const widthStyle =
                                            typeof width === "number"
                                                ? { width: `${width}px` }
                                                : typeof width === "string" &&
                                                    !width.startsWith("w-")
                                                  ? { width }
                                                  : undefined;

                                        return (
                                            <col
                                                key={`${column.sortField || column.label || "column"}-${index}`}
                                                className={widthClass}
                                                style={widthStyle}
                                            />
                                        );
                                    },
                                )}
                            </colgroup>
                            <thead className="border-b border-gray-200 bg-[#f8fafc]">
                                <tr>
                                    <th
                                        scope="col"
                                        className="py-4 pr-3 pl-4 sm:pl-6"
                                    ></th>
                                    {tableColumns.map(
                                        (column: any, index: number) =>
                                            tableTh({
                                                label: column.label,
                                                sortField: column.sortField,
                                                sortable: column.sortable,
                                                width: getColumnWidth(
                                                    column,
                                                    index,
                                                ),
                                            }),
                                    )}
                                </tr>
                            </thead>
                            {React.Children.count(children) > 0 ? (
                                children
                            ) : (
                                <tbody>
                                    <tr>
                                        <td
                                            colSpan={tableColumns.length + 1}
                                            className="py-16 text-center"
                                        >
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#b4b4b4] to-[#b4b4b4]">
                                                    <svg
                                                        className="h-8 w-8 text-[#0a0a0a]"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="text-center">
                                                    {/* <h3 className="mb-1 text-lg font-medium text-gray-700">
                                                        No Data Available
                                                    </h3> */}
                                                    <p className="text-sm text-gray-500">
                                                        There are no records to
                                                        display at the moment.
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {React.Children.count(children) > 0 && (
                <div className="flex justify-center pt-4">
                    <Pagination links={links} />
                </div>
            )}
        </div>
    );
}
