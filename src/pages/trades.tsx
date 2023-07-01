import { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Table } from '@app/modules/common/components/Table';
import { SortOrder } from '@app/modules/common/constants/sort-order';
import {
  addToastMessage,
  ToastType,
} from '@app/modules/common/redux/toast.slice';
import { TradePathModal } from '@app/modules/trade-paths/containers/TradePathModal';
import { TradePathsSortBy } from '@app/modules/trade-paths/dtos/find-trade-paths.dto';
import { findTradePathsRequest } from '@app/modules/trade-paths/redux/trade-paths.slice';
import { UserItem } from '@app/modules/user-items/schemas/user-item';
import { AppState } from '@app/redux/store';

const FindTrades: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const [sortedTradePaths, setSortedTradePaths] = useState<UserItem[][]>([]);
  const [tradePathsSortBy, setTradePathsSortBy] = useState(
    TradePathsSortBy.TradeCount,
  );
  const [tradePathsSortOrder, setTradePathsSortOrder] = useState(SortOrder.Asc);

  enum OpenModal {
    None,
    TradePath,
  }
  const [openModal, setOpenModal] = useState(OpenModal.None);
  const [selectedPathIndex, setSelectedPathIndex] = useState(-1);

  const tradePaths = useSelector((state: AppState) => state.tradePaths.paths);
  const isFindTradePathsLoading = useSelector(
    (state: AppState) => state.tradePaths.findTradePaths.isLoading,
  );
  const findTradePathsError = useSelector(
    (state: AppState) => state.tradePaths.findTradePaths.error,
  );

  const dispatch = useDispatch();

  // Effects & Callbacks

  const findTradePaths = useCallback((): void => {
    dispatch(findTradePathsRequest({}));
  }, [dispatch]);

  useEffect(() => {
    findTradePaths();
  }, [findTradePaths]);

  useEffect(() => {
    setSortedTradePaths([...tradePaths]);
  }, [tradePaths]);

  const compare = useCallback(
    (value1: string | number, value2: string | number): -1 | 0 | 1 => {
      if (value1 < value2) {
        return tradePathsSortOrder === SortOrder.Asc ? -1 : 1;
      }
      if (value1 > value2) {
        return tradePathsSortOrder === SortOrder.Asc ? 1 : -1;
      }
      return 0;
    },
    [tradePathsSortOrder],
  );

  const compareItems = useCallback(
    (paths1: UserItem[], paths2: UserItem[]): -1 | 0 | 1 => {
      return (
        compare(paths1[0].item?.name ?? '', paths2[0].item?.name ?? '') ||
        compare(
          paths1[0].user?.displayName ?? '',
          paths2[0].user?.displayName ?? '',
        )
      );
    },
    [compare],
  );

  const compareWishes = useCallback(
    (paths1: UserItem[], paths2: UserItem[]): -1 | 0 | 1 => {
      return (
        compare(
          paths1.slice(-1)[0].item?.name ?? '',
          paths2.slice(-1)[0].item?.name ?? '',
        ) ||
        compare(
          paths1.slice(-1)[0].user?.displayName ?? '',
          paths2.slice(-1)[0].user?.displayName ?? '',
        )
      );
    },
    [compare],
  );

  const compareTradeCounts = useCallback(
    (paths1: UserItem[], paths2: UserItem[]): -1 | 0 | 1 => {
      return compare(paths1.length, paths2.length);
    },
    [compare],
  );

  useEffect(() => {
    const newSortedTradePaths = [...tradePaths];

    switch (tradePathsSortBy) {
      case TradePathsSortBy.Item:
        newSortedTradePaths.sort((a, b) => {
          return (
            compareItems(a, b) ||
            compareWishes(a, b) ||
            compareTradeCounts(a, b)
          );
        });
        break;
      case TradePathsSortBy.Wish:
        newSortedTradePaths.sort((a, b) => {
          return (
            compareWishes(a, b) ||
            compareItems(a, b) ||
            compareTradeCounts(a, b)
          );
        });
        break;
      case TradePathsSortBy.TradeCount:
        newSortedTradePaths.sort((a, b) => {
          return (
            compareTradeCounts(a, b) ||
            compareItems(a, b) ||
            compareWishes(a, b)
          );
        });
        break;
      default:
        break;
    }

    setSortedTradePaths(newSortedTradePaths);
  }, [
    tradePaths,
    tradePathsSortBy,
    tradePathsSortOrder,
    compareItems,
    compareWishes,
    compareTradeCounts,
  ]);

  useEffect(() => {
    if (isFindTradePathsLoading || !findTradePathsError) {
      return;
    }

    dispatch(
      addToastMessage({
        type: ToastType.Error,
        message: `Failed to find available trades: ${
          (findTradePathsError.response?.data as { message?: string })
            ?.message ?? findTradePathsError.message
        }`,
      }),
    );
  }, [isFindTradePathsLoading, findTradePathsError, dispatch]);

  // Handlers

  const handleSelectHeader = (headerSortBy: string): void => {
    if (tradePathsSortBy === headerSortBy) {
      setTradePathsSortOrder(
        tradePathsSortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc,
      );
    } else {
      setTradePathsSortOrder(SortOrder.Asc);
    }
    setTradePathsSortBy(headerSortBy as TradePathsSortBy);
  };

  const handleSelectRow = (key: string): void => {
    setOpenModal(OpenModal.TradePath);
    setSelectedPathIndex(parseInt(key, 10));
  };

  const handleCloseModal = (): void => {
    setOpenModal(OpenModal.None);
    setSelectedPathIndex(-1);
  };

  // Elements

  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-center p-8">
        <Head>
          <title>{`${appName} - Trades`}</title>
        </Head>
        <div className="flex w-full flex-row items-center justify-between pb-6">
          <span className="pl-4 text-4xl font-bold">Available Trades</span>
        </div>
        <div className="h-0 w-full grow-[1]">
          <Table
            totalCount={tradePaths.length}
            headers={[
              {
                value: 'Item',
                className: 'w-[42%]',
                sortBy: TradePathsSortBy.Item,
              },
              {
                value: 'Wish',
                className: 'w-[42%]',
                sortBy: TradePathsSortBy.Wish,
              },
              {
                value: '# of Trades',
                className: 'w-[16%]',
                sortBy: TradePathsSortBy.TradeCount,
              },
            ]}
            data={sortedTradePaths.map((path, index) => {
              return {
                key: `${index}`,
                values: [
                  `${path[0].item?.name}`,
                  {
                    title: `${path.slice(-1)[0].item?.name}\n\tOwner: ${
                      path.slice(-1)[0].user?.displayName
                    }`,
                    node: (
                      <div
                        key={`${path.slice(-1)[0].item?.name}\n\tOwner: ${
                          path.slice(-1)[0].user?.displayName
                        }`}
                      >
                        <span>{`${path.slice(-1)[0].item?.name}\n`}</span>
                        <span className="pl-6 text-xs font-bold italic">
                          Owner:{' '}
                        </span>
                        <span className="text-xs font-normal italic">{`${
                          path.slice(-1)[0].user?.displayName
                        }`}</span>
                      </div>
                    ),
                  },
                  `${path.length - 1}`,
                ],
              };
            })}
            rowLineCount={2}
            sortBy={tradePathsSortBy}
            sortOrder={tradePathsSortOrder}
            onSelectHeader={handleSelectHeader}
            onSelectRow={handleSelectRow}
          />
        </div>
      </div>

      {((): JSX.Element | undefined => {
        switch (openModal) {
          case OpenModal.TradePath:
            if (selectedPathIndex >= 0) {
              return (
                <TradePathModal
                  tradePath={sortedTradePaths[selectedPathIndex]}
                  onClose={handleCloseModal}
                />
              );
            }
            break;
          default:
            break;
        }
        return undefined;
      })()}
    </>
  );
};

export default FindTrades;
