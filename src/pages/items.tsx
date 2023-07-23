import { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CardGrid } from '@app/modules/common/components/CardGrid';
import { PrimaryButton } from '@app/modules/common/components/PrimaryButton';
import { Search } from '@app/modules/common/components/Search';
import { SortOrder } from '@app/modules/common/constants/sort-order';
import {
  addToastMessage,
  ToastType,
} from '@app/modules/common/redux/toast.slice';
import { AddUserItemModal } from '@app/modules/user-items/containers/AddUserItemModal';
import { EditUserItemModal } from '@app/modules/user-items/containers/EditUserItemModal';
import { GetUserItemsSortBy } from '@app/modules/user-items/dtos/get-user-items.dto';
import {
  getUserItemsRequest,
  toggleIsMyItems,
} from '@app/modules/user-items/redux/user-items.slice';
import { UserItem } from '@app/modules/user-items/schemas/user-item';
import { AppState } from '@app/redux/store';

const MyItems: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const [userItemsSearchItemName, setUserItemsSearchItemName] = useState('');
  const [userItemsPage, setUserItemsPage] = useState(1);
  const [userItemsCount, setUserItemsCount] = useState(10);

  enum OpenModal {
    None,
    Add,
    Edit,
  }
  const [openModal, setOpenModal] = useState(OpenModal.None);
  const [selectedItem, setSelectedItem] = useState<UserItem | undefined>();

  const user = useSelector((state: AppState) => state.auth.user);

  const isMyItems = useSelector((state: AppState) => state.userItems.isMyItems);
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
        searchUserId: isMyItems ? user?.id : undefined,
        searchItemName: userItemsSearchItemName,
        page: userItemsPage,
        count: userItemsCount,
        sortBy: GetUserItemsSortBy.ItemName,
        sortOrder: SortOrder.Asc,
      }),
    );
  }, [
    userItemsSearchItemName,
    userItemsPage,
    userItemsCount,
    user,
    isMyItems,
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

  const handleClickIsMyItems = (): void => {
    dispatch(toggleIsMyItems());
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
          <title>{`${appName} - Items`}</title>
        </Head>

        <div className="flex w-full flex-col pb-6">
          <div className="flex w-full justify-between max-md:flex-col max-md:items-center max-md:space-y-4 md:flex-row md:items-start">
            <span className="pl-4 text-center text-4xl font-bold">Items</span>
            <div className="flex space-x-4 px-2">
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
              htmlFor="isMyItems"
              className="mt-3 flex w-fit cursor-pointer flex-row-reverse items-center justify-end p-1 md:ml-3"
            >
              <span className="pl-2 font-semibold">Only show my items</span>
              <input
                id="isMyItems"
                type="checkbox"
                className="cursor-pointer"
                checked={isMyItems}
                onClick={handleClickIsMyItems}
              />
            </label>
          )}
        </div>
        <div className="h-0 w-full grow-[1]">
          <CardGrid
            totalCount={totalUserItemCount}
            data={userItems.map((userItem) => {
              return {
                key: userItem.id,
                title: `${userItem.item?.name ?? ''}${
                  userItem.remarks ? `\n\n${userItem.remarks}` : ''
                }\n\nOwner: ${userItem.user?.displayName}`,
                node: (
                  <>
                    <span className="line-clamp-2 whitespace-pre-wrap break-words text-xl font-bold">
                      {userItem.item?.name}
                    </span>
                    <span className="line-clamp-2 whitespace-pre-wrap break-words pl-6 font-normal">
                      {userItem.remarks}
                    </span>
                    <div className="truncate">
                      <span className="pl-6 font-bold italic">Owner: </span>
                      <span className="font-normal italic">
                        {userItem.user?.displayName}
                      </span>
                    </div>
                  </>
                ),
              };
            })}
            page={userItemsPage}
            count={userItemsCount}
            onSelectCard={handleClickEdit}
            onSelectPage={handleSelectPage}
            onSelectCount={handleSelectCount}
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
