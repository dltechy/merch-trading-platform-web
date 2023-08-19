import { ChangeEvent, FC, KeyboardEvent, ReactNode, useState } from 'react';

import { Card } from './Card';
import { Dropdown } from './Dropdown';

interface Props {
  totalCount: number;
  data: {
    key: string;
    title?: string;
    node: ReactNode;
  }[];
  page?: number;
  count?: number;
  onSelectCard?: (key: string) => void;
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

export const CardGrid: FC<Props> = ({
  totalCount,
  data,
  page,
  count,
  onSelectCard,
  onSelectPage,
  onSelectCount,
}) => {
  // Properties

  const totalPageCount = count ? Math.ceil(totalCount / count) : 0;
  const pageNumbers: number[] = page
    ? createPageNumbers(totalPageCount, page)
    : [];

  const [hoveredCardKey, setHoveredCardKey] = useState('');

  // Handlers

  const handleCardFocus = (key: string): void => {
    if (!onSelectCard) {
      return;
    }

    setHoveredCardKey(key);
  };

  const handleCardBlur = (): void => {
    if (!onSelectCard) {
      return;
    }

    setHoveredCardKey('');
  };

  const handleSelectCard = (key: string): void => {
    onSelectCard?.(key);
  };

  const handleSelectCardKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    key: string,
  ): void => {
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }

    handleSelectCard(key);
  };

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
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {data.map(({ key, title, node }) => {
              return (
                <Card
                  key={key}
                  className={`flex h-fit w-full flex-col px-6 py-4 ${
                    hoveredCardKey === key
                      ? 'cursor-pointer bg-card-hovered-primary text-card-hovered-secondary'
                      : 'bg-card-primary text-card-secondary '
                  }`}
                  title={title}
                  tabIndex={onSelectCard ? 0 : -1}
                  onMouseOver={(): void => handleCardFocus(key)}
                  onFocus={(): void => handleCardFocus(key)}
                  onMouseOut={(): void => handleCardBlur()}
                  onBlur={(): void => handleCardBlur()}
                  onClick={(): void => handleSelectCard(key)}
                  onKeyDown={(e): void => handleSelectCardKeyDown(e, key)}
                >
                  {node}
                </Card>
              );
            })}
          </div>
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
                    ? 'cursor-pointer hover:text-link-hovered hover:underline'
                    : 'text-disabled-secondary'
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
                    className={`cursor-pointer p-2 underline-offset-4 hover:text-link-hovered ${
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
                    ? 'cursor-pointer hover:text-link-hovered hover:underline'
                    : 'text-disabled-secondary'
                }`}
                type="button"
                value=">"
                disabled={page === totalPageCount}
                onClick={(): void => handleSelectPage(page + 1)}
              />
            </div>
            <label
              htmlFor="cardCount"
              className="flex items-end max-md:w-1/2 max-md:flex-col max-md:pt-10 md:items-center md:whitespace-pre"
            >
              <span className="pr-2 font-bold hover:cursor-text">
                Items per page:{' '}
              </span>
              <div className="w-24">
                <Dropdown
                  id="cardCount"
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
