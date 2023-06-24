import { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PrimaryButton } from '@app/modules/common/components/PrimaryButton';
import { Search } from '@app/modules/common/components/Search';
import { Table } from '@app/modules/common/components/Table';
import { SortOrder } from '@app/modules/common/constants/sort-order';
import {
  addToastMessage,
  ToastType,
} from '@app/modules/common/redux/toast.slice';
import { AddUserItemModal } from '@app/modules/user-items/containers/AddUserItemModal';
import { GetUserItemsSortBy } from '@app/modules/user-items/dtos/get-user-items.dto';
import { getUserItemsRequest } from '@app/modules/user-items/redux/user-items.slice';
import { AppState } from '@app/redux/store';

const MyItems: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const [userItemsSearchItemName, setUserItemsSearchItemName] = useState('');
  const [userItemsPage, setUserItemsPage] = useState(1);
  const [userItemsCount, setUserItemsCount] = useState(10);
  const [userItemsSortBy, setUserItemsSortBy] = useState(
    GetUserItemsSortBy.ItemName,
  );
  const [userItemsSortOrder, setUserItemsSortOrder] = useState(SortOrder.Asc);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const user = useSelector((state: AppState) => state.auth.user);

  const totalUserItemCount = useSelector(
    (state: AppState) => state.userItems.totalCount,
  );
  const userItems = useSelector((state: AppState) => state.userItems.userItems);
  const getUserItemsError = useSelector(
    (state: AppState) => state.userItems.getUserItems.error,
  );

  const dispatch = useDispatch();

  // Effects & Callbacks

  const getUserItems = useCallback((): void => {
    dispatch(
      getUserItemsRequest({
        searchUserId: user?.id,
        searchItemName: userItemsSearchItemName,
        page: userItemsPage,
        count: userItemsCount,
        sortBy: userItemsSortBy,
        sortOrder: userItemsSortOrder,
      }),
    );
  }, [
    userItemsSearchItemName,
    userItemsPage,
    userItemsCount,
    userItemsSortBy,
    userItemsSortOrder,
    user,
    dispatch,
  ]);

  useEffect(() => {
    getUserItems();
  }, [getUserItems]);

  useEffect(() => {
    if (!getUserItemsError) {
      return;
    }

    dispatch(
      addToastMessage({
        type: ToastType.Error,
        message: `Failed to load items: ${
          (getUserItemsError.response?.data as { message?: string })?.message ??
          getUserItemsError.message
        }`,
      }),
    );
  }, [getUserItemsError, dispatch]);

  // Handlers

  const handleSelectHeader = (headerSortBy: string): void => {
    if (userItemsSortBy === headerSortBy) {
      setUserItemsSortOrder(
        userItemsSortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc,
      );
    } else {
      setUserItemsSortOrder(SortOrder.Asc);
    }
    setUserItemsSortBy(headerSortBy as GetUserItemsSortBy);
  };

  const handleSelectPage = (page: number): void => {
    setUserItemsPage(page);
  };

  const handleSelectCount = (count: number): void => {
    setUserItemsCount(count);
  };

  const handleSearch = ({
    searchString,
  }: {
    searchKey?: string;
    searchString: string;
  }): void => {
    setUserItemsSearchItemName(searchString);
  };

  const handleClickAdd = (): void => {
    setIsAddModalOpen(true);
  };

  const handleAdd = (): void => {
    getUserItems();
    setIsAddModalOpen(false);
  };

  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
  };

  // Elements

  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-center p-8">
        <Head>
          <title>{`${appName} - My Items`}</title>
        </Head>

        <div className="flex w-full flex-row items-center justify-between pb-6">
          <span className="pl-4 text-4xl font-bold">My Items</span>
          <div className="flex space-x-4 pr-2">
            <div className="w-24">
              <PrimaryButton value="+ Add" onClick={handleClickAdd} />
            </div>
            <Search onSearch={handleSearch} isAutoSearchAllowed />
          </div>
        </div>
        <div className="h-0 w-full grow-[1]">
          <Table
            totalCount={totalUserItemCount}
            headers={[
              {
                value: 'Name',
                className: 'w-1/3',
                sortBy: GetUserItemsSortBy.ItemName,
              },
              {
                value: 'Description',
                className: 'w-1/3',
              },
              {
                value: 'Remarks',
                className: 'w-1/3',
              },
            ]}
            data={userItems.map((userItem) => {
              return {
                key: userItem.id,
                values: [
                  userItem.item?.name ?? '',
                  userItem.item?.description ?? '',
                  userItem.remarks,
                ],
              };
            })}
            sortBy={userItemsSortBy}
            sortOrder={userItemsSortOrder}
            page={userItemsPage}
            count={userItemsCount}
            onSelectHeader={handleSelectHeader}
            onSelectPage={handleSelectPage}
            onSelectCount={handleSelectCount}
          />
        </div>
      </div>

      {isAddModalOpen && (
        <AddUserItemModal onAdd={handleAdd} onClose={handleCloseAddModal} />
      )}
    </>
  );
};

export default MyItems;
