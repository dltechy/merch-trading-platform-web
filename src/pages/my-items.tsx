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
import { DeleteUserItemModal } from '@app/modules/user-items/containers/DeleteUserItemModal';
import { EditUserItemModal } from '@app/modules/user-items/containers/EditUserItemModal';
import { GetUserItemsSortBy } from '@app/modules/user-items/dtos/get-user-items.dto';
import { getUserItemsRequest } from '@app/modules/user-items/redux/user-items.slice';
import { UserItem } from '@app/modules/user-items/schemas/user-item';
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

  enum OpenModal {
    None,
    Add,
    Edit,
    Delete,
  }
  const [openModal, setOpenModal] = useState(OpenModal.None);
  const [selectedItem, setSelectedItem] = useState<UserItem | undefined>();

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
    setOpenModal(OpenModal.Add);
  };

  const handleAdd = (): void => {
    getUserItems();
    setOpenModal(OpenModal.None);
  };

  const handleClickEdit = (id: string): void => {
    setOpenModal(OpenModal.Edit);
    setSelectedItem(userItems.find((userItem) => userItem.id === id));
  };

  const handleEdit = (): void => {
    getUserItems();
    setOpenModal(OpenModal.None);
    setSelectedItem(undefined);
  };

  const handleClickDelete = (id: string): void => {
    setOpenModal(OpenModal.Delete);
    setSelectedItem(userItems.find((userItem) => userItem.id === id));
  };

  const handleDelete = (): void => {
    if (userItemsPage > 1 && userItems.length === 1) {
      setUserItemsPage(userItemsPage - 1);
    } else {
      getUserItems();
    }
    setOpenModal(OpenModal.None);
    setSelectedItem(undefined);
  };

  const handleCloseModal = (): void => {
    setOpenModal(OpenModal.None);
    setSelectedItem(undefined);
  };

  // Elements

  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-center p-8">
        <Head>
          <title>{`${appName} - My Items`}</title>
        </Head>

        <div className="flex w-full items-center justify-between pb-6 max-md:flex-col max-md:space-y-4 md:flex-row">
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
            onEdit={handleClickEdit}
            onDelete={handleClickDelete}
          />
        </div>
      </div>

      {((): JSX.Element | undefined => {
        switch (openModal) {
          case OpenModal.Add:
            return (
              <AddUserItemModal onAdd={handleAdd} onClose={handleCloseModal} />
            );
          case OpenModal.Edit:
            if (selectedItem) {
              return (
                <EditUserItemModal
                  userItem={selectedItem}
                  onEdit={handleEdit}
                  onClose={handleCloseModal}
                />
              );
            }
            break;
          case OpenModal.Delete:
            if (selectedItem) {
              return (
                <DeleteUserItemModal
                  userItem={selectedItem}
                  onDelete={handleDelete}
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

export default MyItems;
