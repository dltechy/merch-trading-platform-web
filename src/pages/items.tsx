import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Table } from '@app/modules/common/components/Table';
import { SortOrder } from '@app/modules/common/constants/sort-order';
import {
  addToastMessage,
  ToastType,
} from '@app/modules/common/redux/toast.slice';
import { GetItemsSortBy } from '@app/modules/items/dtos/get-items.dto';
import {
  getItemsRequest,
  resetItemsState,
} from '@app/modules/items/redux/items.slice';
import { AppState } from '@app/redux/store';

const Items: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const [itemsSearchName] = useState('');
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsCount, setItemsCount] = useState(10);
  const [itemsSortBy, setItemsSortBy] = useState(GetItemsSortBy.Name);
  const [itemsSortOrder, setItemsSortOrder] = useState(SortOrder.Asc);

  const totalItemCount = useSelector(
    (state: AppState) => state.items.totalCount,
  );
  const items = useSelector((state: AppState) => state.items.items);
  const getItemsError = useSelector(
    (state: AppState) => state.items.getItems.error,
  );

  const dispatch = useDispatch();

  // Effects

  useEffect(() => {
    dispatch(
      getItemsRequest({
        searchName: itemsSearchName,
        page: itemsPage,
        count: itemsCount,
        sortBy: itemsSortBy,
        sortOrder: itemsSortOrder,
      }),
    );
  }, [
    itemsSearchName,
    itemsPage,
    itemsCount,
    itemsSortBy,
    itemsSortOrder,
    dispatch,
  ]);

  useEffect(() => {
    if (!getItemsError) {
      return;
    }

    dispatch(
      addToastMessage({
        type: ToastType.Error,
        message: `Failed to load items: ${
          (getItemsError.response?.data as { message?: string })?.message ??
          getItemsError.message
        }`,
      }),
    );

    dispatch(resetItemsState({ getItems: true }));
  }, [getItemsError, dispatch]);

  // Handlers

  const handleSelectHeader = (headerSortBy: string): void => {
    if (itemsSortBy === headerSortBy) {
      setItemsSortOrder(
        itemsSortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc,
      );
    } else {
      setItemsSortOrder(SortOrder.Asc);
    }
    setItemsSortBy(headerSortBy as GetItemsSortBy);
  };

  const handleSelectPage = (page: number): void => {
    setItemsPage(page);
  };

  const handleSelectCount = (count: number): void => {
    setItemsCount(count);
  };

  // Elements

  return (
    <div className="flex h-full w-full flex-col items-start justify-center p-8">
      <Head>
        <title>{`${appName} - Items`}</title>
      </Head>

      <div className="flex w-full flex-row items-center pb-6">
        <span className="pl-4 text-4xl font-bold">Tradable Items</span>
      </div>
      <div className="h-0 w-full grow-[1]">
        <Table
          totalCount={totalItemCount}
          headers={[
            {
              value: 'Name',
              className: 'w-1/2',
              sortBy: GetItemsSortBy.Name,
            },
            {
              value: 'Description',
              className: 'w-1/2',
            },
          ]}
          data={items.map((item) => {
            return {
              key: item.id,
              values: [item.name, item.description],
            };
          })}
          sortBy={itemsSortBy}
          sortOrder={itemsSortOrder}
          page={itemsPage}
          count={itemsCount}
          onSelectHeader={handleSelectHeader}
          onSelectPage={handleSelectPage}
          onSelectCount={handleSelectCount}
        />
      </div>
    </div>
  );
};

export default Items;
