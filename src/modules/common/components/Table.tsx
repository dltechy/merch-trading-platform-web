import { ChangeEvent, FC, KeyboardEvent, ReactNode, useState } from 'react';

import DeleteSvg from '@public/images/delete.svg';
import EditSvg from '@public/images/edit.svg';

import { SortOrder } from '../constants/sort-order';
import { Dropdown } from './Dropdown';
import { ImageButton } from './ImageButton';

interface Props {
  totalCount: number;
  headers: {
    value: string;
    className?: string;
    sortBy?: string;
  }[];
  data: {
    key: string;
    values: (
      | {
          title?: string;
          node: ReactNode;
        }
      | string
    )[];
    isEditable?: boolean;
    isDeletable?: boolean;
  }[];
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: number;
  count?: number;
  rowLineCount?: number;
  onSelectHeader?: (headerSortBy: string) => void;
  onSelectRow?: (key: string) => void;
  onSelectPage?: (page: number) => void;
  onSelectCount?: (count: number) => void;
  onEdit?: (key: string) => void;
  onDelete?: (key: string) => void;
}

function createPageNumbers(totalPageCount: number, page: number): number[] {
  const pageNumbers: number[] = [];

  let startPageNumber = page - 2;
  let endPageNumber = page + 2;

  if (startPageNumber < 1) {
    endPageNumber -= startPageNumber - 1;
    startPageNumber = 1;
  }
  if (endPageNumber > totalPageCount) {
    startPageNumber = Math.max(
      startPageNumber - (endPageNumber - totalPageCount),
      1,
    );
    endPageNumber = Math.max(totalPageCount, 1);
  }

  for (let i = startPageNumber; i <= endPageNumber; i += 1) {
    pageNumbers.push(i);
  }

  return pageNumbers;
}

export const Table: FC<Props> = ({
  totalCount,
  headers,
  data,
  sortBy,
  sortOrder,
  page,
  count,
  rowLineCount = 1,
  onSelectHeader,
  onSelectRow,
  onSelectPage,
  onSelectCount,
  onEdit,
  onDelete,
}) => {
  // Properties

  const minRowCount = rowLineCount === 1 ? 10 : 8;

  const totalPageCount = count ? Math.ceil(totalCount / count) : 0;
  const pageNumbers: number[] = page
    ? createPageNumbers(totalPageCount, page)
    : [];

  const [hoveredRowKey, setHoveredRowKey] = useState('');

  // Handlers

  const handleSelectHeader = (headerSortBy: string): void => {
    onSelectHeader?.(headerSortBy);
  };

  const handleSelectHeaderKeyDown = (
    e: KeyboardEvent<HTMLTableCellElement>,
    headerSortBy: string,
  ): void => {
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }

    handleSelectHeader(headerSortBy);
  };

  const handleRowFocus = (key: string): void => {
    if (!onSelectRow) {
      return;
    }

    setHoveredRowKey(key);
  };

  const handleRowBlur = (): void => {
    if (!onSelectRow) {
      return;
    }

    setHoveredRowKey('');
  };

  const handleSelectRow = (key: string): void => {
    onSelectRow?.(key);
  };

  const handleSelectRowKeyDown = (
    e: KeyboardEvent<HTMLTableRowElement>,
    key: string,
  ): void => {
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }

    handleSelectRow(key);
  };

  const handleSelectPage = (pageNumber: number): void => {
    onSelectPage?.(pageNumber);
  };

  const handleSelectCount = (e: ChangeEvent<HTMLSelectElement>): void => {
    onSelectCount?.(parseInt(e.target.value, 10));

    handleSelectPage(1);
  };

  const handleEdit = (key: string): void => {
    onEdit?.(key);
  };

  const handleDelete = (key: string): void => {
    onDelete?.(key);
  };

  // Elements

  return (
    <div className="flex h-full w-full flex-col">
      <div className="overflow-hidden rounded-lg">
        <div className="h-full overflow-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0">
              <tr className="bg-blue-600 text-white [&>th+th]:border-l-2 [&>th+th]:border-cyan-400">
                {headers.map(
                  ({ value, className = '', sortBy: headerSortBy }, index) => {
                    return (
                      <th
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        className={`truncate px-4 py-3 ${
                          headerSortBy ? 'cursor-pointer' : ''
                        } ${className}`}
                        tabIndex={headerSortBy ? 0 : -1}
                        onClick={
                          headerSortBy
                            ? (): void => handleSelectHeader(headerSortBy)
                            : undefined
                        }
                        onKeyDown={
                          headerSortBy
                            ? (e): void =>
                                handleSelectHeaderKeyDown(e, headerSortBy)
                            : undefined
                        }
                      >
                        <span>{value}</span>
                        {headerSortBy && headerSortBy === sortBy ? (
                          <span className="select-none pl-2">
                            {sortOrder === SortOrder.Asc ? '▲' : '▼'}
                          </span>
                        ) : undefined}
                      </th>
                    );
                  },
                )}
                {(onEdit || onDelete) && (
                  <th key={headers.length} className="w-24 select-none py-3">
                    &nbsp;
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map(({ key, values, isEditable, isDeletable }) => {
                return (
                  <tr
                    key={key}
                    className={`font-semibold [&>td+td]:border-l-2 [&>td+td]:border-cyan-400 ${
                      hoveredRowKey === key
                        ? `cursor-pointer bg-blue-400`
                        : 'odd:bg-blue-200 even:bg-blue-100'
                    } ${
                      onEdit || onDelete
                        ? '[&>:last-child]:odd:bg-blue-200 [&>:last-child]:even:bg-blue-100'
                        : ''
                    }`}
                    tabIndex={onSelectRow ? 0 : -1}
                    onMouseOver={(): void => handleRowFocus(key)}
                    onFocus={(): void => handleRowFocus(key)}
                    onMouseOut={(): void => handleRowBlur()}
                    onBlur={(): void => handleRowBlur()}
                    onClick={(): void => handleSelectRow(key)}
                    onKeyDown={(e): void => handleSelectRowKeyDown(e, key)}
                  >
                    {values.map((value, index) => {
                      let title: string | undefined;
                      let node: ReactNode;
                      if (typeof value === 'string') {
                        title = value;
                        node = value;
                      } else {
                        title = value.title;
                        node = value.node;
                      }

                      return (
                        <td
                          // eslint-disable-next-line react/no-array-index-key
                          key={index}
                          className="truncate px-4 py-3"
                          title={title}
                        >
                          <span
                            className={`h-fit whitespace-pre-wrap ${
                              rowLineCount === 1
                                ? 'line-clamp-1 h-6'
                                : 'line-clamp-2 h-12'
                            }`}
                          >
                            {node}
                          </span>
                        </td>
                      );
                    })}
                    {(onEdit || onDelete) && (
                      <td
                        // eslint-disable-next-line react/no-array-index-key
                        key={values.length}
                        className="h-[1px] p-0"
                      >
                        <button
                          className="h-full w-full cursor-default px-2 py-1"
                          type="button"
                          tabIndex={-1}
                          onMouseOver={(e): void => {
                            e.stopPropagation();
                            handleRowBlur();
                          }}
                          onFocus={(e): void => {
                            e.stopPropagation();
                            handleRowBlur();
                          }}
                          onClick={(e): void => e.stopPropagation()}
                          onKeyDown={(e): void => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center space-x-1">
                            {isEditable && (
                              <ImageButton
                                SvgImage={EditSvg}
                                title="Edit"
                                onClick={(): void => handleEdit(key)}
                              />
                            )}
                            {isDeletable && (
                              <ImageButton
                                SvgImage={DeleteSvg}
                                title="Delete"
                                onClick={(): void => handleDelete(key)}
                              />
                            )}
                          </div>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
              {data.length < minRowCount &&
                Array.from(Array(minRowCount - data.length)).map(
                  (_placeholderRow, indexRow) => {
                    return (
                      <tr
                        // eslint-disable-next-line react/no-array-index-key
                        key={`placeholder-${indexRow}`}
                        className="font-semibold odd:bg-blue-200 even:bg-blue-100 [&>td+td]:border-l-2 [&>td+td]:border-cyan-400"
                      >
                        {headers.map((_placeholderCol, indexCol) => {
                          return (
                            <td
                              // eslint-disable-next-line react/no-array-index-key
                              key={`placeholder-${indexRow}-${indexCol}`}
                              className="px-4 py-3"
                            >
                              <div
                                className={`select-none whitespace-pre-wrap ${
                                  rowLineCount === 1
                                    ? 'line-clamp-1 h-6'
                                    : 'line-clamp-2 h-12'
                                }`}
                              >
                                &nbsp;
                              </div>
                            </td>
                          );
                        })}
                        {(onEdit || onDelete) && (
                          <td
                            // eslint-disable-next-line react/no-array-index-key
                            key={`placeholder-${indexRow}-${headers.length}`}
                            className="select-none px-2 py-1"
                          >
                            <div className="invisible flex items-center space-x-1">
                              <ImageButton SvgImage={EditSvg} title="Edit" />
                              <ImageButton
                                SvgImage={DeleteSvg}
                                title="Delete"
                              />
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  },
                )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex w-full items-start justify-between px-4 text-lg md:items-center md:pt-4">
        <div
          className={`flex max-md:w-1/2 ${
            page != null && count != null
              ? 'max-md:flex-col max-md:pt-10 md:whitespace-pre'
              : 'whitespace-pre max-md:pt-2'
          }`}
        >
          <span className="font-bold">Total count: </span>
          <span>{totalCount}</span>
        </div>

        {page != null && count != null && (
          <>
            <div className="absolute left-1/2 flex -translate-x-1/2 items-center text-xl font-semibold">
              <input
                className={`p-2 underline-offset-4 ${
                  page > 1
                    ? 'cursor-pointer hover:text-blue-800 hover:underline'
                    : 'text-gray-500'
                }`}
                type="button"
                value="<"
                disabled={page === 1}
                onClick={(): void => handleSelectPage(page - 1)}
              />
              {pageNumbers.map((pageNumber) => {
                return (
                  <input
                    key={pageNumber}
                    className={`cursor-pointer p-2 underline-offset-4 hover:text-blue-800 ${
                      pageNumber === page ? 'underline' : 'hover:underline'
                    }`}
                    type="button"
                    value={` ${pageNumber} `}
                    onClick={(): void => handleSelectPage(pageNumber)}
                  />
                );
              })}
              <input
                className={`p-2 underline-offset-4 ${
                  page < totalPageCount
                    ? 'cursor-pointer hover:text-blue-800 hover:underline'
                    : 'text-gray-500'
                }`}
                type="button"
                value=">"
                disabled={page === totalPageCount}
                onClick={(): void => handleSelectPage(page + 1)}
              />
            </div>
            <label
              htmlFor="rowCount"
              className="flex items-end max-md:w-1/2 max-md:flex-col max-md:pt-10 md:items-center md:whitespace-pre"
            >
              <span className="pr-2 font-bold hover:cursor-text">
                Items per page:{' '}
              </span>
              <div className="w-24">
                <Dropdown
                  id="rowCount"
                  values={[10, 20, 50, 100]}
                  selectedValue={count}
                  onChange={handleSelectCount}
                />
              </div>
            </label>
          </>
        )}
      </div>
    </div>
  );
};
