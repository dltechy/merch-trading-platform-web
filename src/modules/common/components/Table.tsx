import { ChangeEvent, FC } from 'react';

import { Dropdown } from './Dropdown';

interface Props {
  totalCount: number;
  headers: {
    value: string;
    className?: string;
  }[];
  data: {
    key: string;
    values: string[];
  }[];
  page?: number;
  count?: number;
  onSelectPage?: (page: number) => void;
  onSelectCount?: (count: number) => void;
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
  page = 1,
  count = 10,
  onSelectPage,
  onSelectCount,
}) => {
  // Properties

  const totalPageCount = Math.ceil(totalCount / count);
  const pageNumbers: number[] = createPageNumbers(totalPageCount, page);

  // Handlers

  const handleSelectPage = (pageNumber: number): void => {
    onSelectPage?.(pageNumber);
  };

  const handleSelectCount = (e: ChangeEvent<HTMLSelectElement>): void => {
    onSelectCount?.(parseInt(e.target.value, 10));

    handleSelectPage(1);
  };

  // Elements

  return (
    <div className="flex h-full w-full flex-col">
      <div className="overflow-hidden rounded-lg">
        <div className="h-full overflow-auto">
          <table className="w-full table-fixed">
            <thead className="sticky top-0">
              <tr className="bg-blue-600 text-white [&>th+th]:border-l-2 [&>th+th]:border-cyan-400">
                {headers.map(({ value, className = '' }, index) => {
                  return (
                    <th
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className={`truncate px-4 py-3 ${className}`}
                    >
                      {value}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {data.map(({ key, values }) => {
                return (
                  <tr
                    key={key}
                    className="font-semibold odd:bg-blue-200 even:bg-blue-100 [&>td+td]:border-l-2 [&>td+td]:border-cyan-400"
                  >
                    {values.map((value, index) => {
                      return (
                        <td
                          // eslint-disable-next-line react/no-array-index-key
                          key={index}
                          className="truncate px-4 py-3"
                          title={value}
                        >
                          <span className="line-clamp-1 whitespace-pre-wrap">
                            {value}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {data.length < 10 &&
                Array.from(Array(10 - data.length)).map(
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
                              <div className="select-none">&nbsp;</div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  },
                )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex w-full items-center justify-between px-4 pt-4 text-lg">
        <div>
          <span className="font-bold">Total count: </span>
          <span>{totalCount}</span>
        </div>

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

        <label htmlFor="rowCount" className="flex flex-row items-center">
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
      </div>
    </div>
  );
};
