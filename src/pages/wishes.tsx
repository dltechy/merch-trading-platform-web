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
import { toggleIsMyItems } from '@app/modules/user-items/redux/user-items.slice';
import { AddUserWishModal } from '@app/modules/user-wishes/containers/AddUserWishModal';
import { DeleteUserWishModal } from '@app/modules/user-wishes/containers/DeleteUserWishModal';
import { EditUserWishModal } from '@app/modules/user-wishes/containers/EditUserWishModal';
import { GetUserWishesSortBy } from '@app/modules/user-wishes/dtos/get-user-wishes.dto';
import { getUserWishesRequest } from '@app/modules/user-wishes/redux/user-wishes.slice';
import { UserWish } from '@app/modules/user-wishes/schemas/user-wish';
import { AppState } from '@app/redux/store';

const MyWishes: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const [userWishesSearchItemName, setUserWishesSearchItemName] = useState('');
  const [userWishesPage, setUserWishesPage] = useState(1);
  const [userWishesCount, setUserWishesCount] = useState(10);
  const [userWishesSortBy, setUserWishesSortBy] = useState(
    GetUserWishesSortBy.ItemName,
  );
  const [userWishesSortOrder, setUserWishesSortOrder] = useState(SortOrder.Asc);

  enum OpenModal {
    None,
    Add,
    Edit,
    Delete,
  }
  const [openModal, setOpenModal] = useState(OpenModal.None);
  const [selectedWish, setSelectedWish] = useState<UserWish | undefined>();

  const user = useSelector((state: AppState) => state.auth.user);

  const isMyItems = useSelector((state: AppState) => state.userItems.isMyItems);
  const totalUserWishCount = useSelector(
    (state: AppState) => state.userWishes.totalCount,
  );
  const userWishes = useSelector(
    (state: AppState) => state.userWishes.userWishes,
  );
  const getUserWishesError = useSelector(
    (state: AppState) => state.userWishes.getUserWishes.error,
  );

  const dispatch = useDispatch();

  // Effects & Callbacks

  const getUserWishes = useCallback((): void => {
    dispatch(
      getUserWishesRequest({
        searchUserId: isMyItems ? user?.id : undefined,
        searchItemName: userWishesSearchItemName,
        page: userWishesPage,
        count: userWishesCount,
        sortBy: userWishesSortBy,
        sortOrder: userWishesSortOrder,
      }),
    );
  }, [
    userWishesSearchItemName,
    userWishesPage,
    userWishesCount,
    userWishesSortBy,
    userWishesSortOrder,
    user,
    isMyItems,
    dispatch,
  ]);

  useEffect(() => {
    getUserWishes();
  }, [getUserWishes]);

  useEffect(() => {
    if (!getUserWishesError) {
      return;
    }

    dispatch(
      addToastMessage({
        type: ToastType.Error,
        message: `Failed to load wishes: ${
          (getUserWishesError.response?.data as { message?: string })
            ?.message ?? getUserWishesError.message
        }`,
      }),
    );
  }, [getUserWishesError, dispatch]);

  // Handlers

  const handleClickIsMyWishes = (): void => {
    dispatch(toggleIsMyItems());
  };

  const handleSelectHeader = (headerSortBy: string): void => {
    if (userWishesSortBy === headerSortBy) {
      setUserWishesSortOrder(
        userWishesSortOrder === SortOrder.Asc ? SortOrder.Desc : SortOrder.Asc,
      );
    } else {
      setUserWishesSortOrder(SortOrder.Asc);
    }
    setUserWishesSortBy(headerSortBy as GetUserWishesSortBy);
  };

  const handleSelectPage = (page: number): void => {
    setUserWishesPage(page);
  };

  const handleSelectCount = (count: number): void => {
    setUserWishesCount(count);
  };

  const handleSearch = ({
    searchString,
  }: {
    searchKey?: string;
    searchString: string;
  }): void => {
    setUserWishesSearchItemName(searchString);
  };

  const handleClickAdd = (): void => {
    setOpenModal(OpenModal.Add);
  };

  const handleAdd = (): void => {
    getUserWishes();
    setOpenModal(OpenModal.None);
  };

  const handleClickEdit = (id: string): void => {
    setOpenModal(OpenModal.Edit);
    setSelectedWish(userWishes.find((userWish) => userWish.id === id));
  };

  const handleEdit = (): void => {
    getUserWishes();
    setOpenModal(OpenModal.None);
    setSelectedWish(undefined);
  };

  const handleClickDelete = (id: string): void => {
    setOpenModal(OpenModal.Delete);
    setSelectedWish(userWishes.find((userWish) => userWish.id === id));
  };

  const handleDelete = (): void => {
    if (userWishesPage > 1 && userWishes.length === 1) {
      setUserWishesPage(userWishesPage - 1);
    } else {
      getUserWishes();
    }
    getUserWishes();
    setOpenModal(OpenModal.None);
    setSelectedWish(undefined);
  };

  const handleCloseModal = (): void => {
    setOpenModal(OpenModal.None);
    setSelectedWish(undefined);
  };

  // Elements

  return (
    <>
      <div className="flex h-full w-full flex-col items-start justify-center p-8">
        <Head>
          <title>{`${appName} - Wishes`}</title>
        </Head>

        <div className="flex w-full flex-col pb-6">
          <div className="flex w-full justify-between max-md:flex-col max-md:items-center max-md:space-y-4 md:flex-row md:items-start">
            <span className="pl-4 text-4xl font-bold">Wishes</span>
            <div className="flex space-x-4 pr-2">
              {user && (
                <div className="w-24">
                  <PrimaryButton value="+ Add" onClick={handleClickAdd} />
                </div>
              )}
              <Search onSearch={handleSearch} isAutoSearchAllowed />
            </div>
          </div>
          {user && (
            <label
              htmlFor="isMyWishes"
              className="mt-3 flex w-fit cursor-pointer flex-row-reverse items-center justify-end p-1 md:ml-3"
            >
              <span className="pl-2 font-semibold">Only show my wishes</span>
              <input
                id="isMyWishes"
                type="checkbox"
                className="cursor-pointer"
                checked={isMyItems}
                onClick={handleClickIsMyWishes}
              />
            </label>
          )}
        </div>
        <div className="h-0 w-full grow-[1]">
          <Table
            totalCount={totalUserWishCount}
            headers={[
              {
                value: 'Name',
                className: 'w-1/2',
                sortBy: GetUserWishesSortBy.ItemName,
              },
              {
                value: 'Remarks',
                className: 'w-1/2',
              },
            ]}
            data={userWishes.map((userWish) => {
              return {
                key: userWish.id,
                values: [userWish.item?.name ?? '', userWish.remarks],
                isEditable: userWish.user?.id === user?.id,
                isDeletable: userWish.user?.id === user?.id,
              };
            })}
            sortBy={userWishesSortBy}
            sortOrder={userWishesSortOrder}
            page={userWishesPage}
            count={userWishesCount}
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
              <AddUserWishModal onAdd={handleAdd} onClose={handleCloseModal} />
            );
          case OpenModal.Edit:
            if (selectedWish) {
              return (
                <EditUserWishModal
                  userWish={selectedWish}
                  onEdit={handleEdit}
                  onClose={handleCloseModal}
                />
              );
            }
            break;
          case OpenModal.Delete:
            if (selectedWish) {
              return (
                <DeleteUserWishModal
                  userWish={selectedWish}
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

export default MyWishes;
