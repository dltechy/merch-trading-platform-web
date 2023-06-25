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
import { AddItemModal } from '@app/modules/items/containers/AddItemModal';
import { DeleteItemModal } from '@app/modules/items/containers/DeleteUserItemModal';
import { EditItemModal } from '@app/modules/items/containers/EditItemModal';
import { GetItemsSortBy } from '@app/modules/items/dtos/get-items.dto';
import {
  getItemsRequest,
  resetItemsState,
} from '@app/modules/items/redux/items.slice';
import { Item } from '@app/modules/items/schemas/item';
import { UserRole } from '@app/modules/users/schemas/user-role';
import { AppState } from '@app/redux/store';

const Items: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const [isAdmin, setIsAdmin] = useState(false);
  const [itemsSearchName, setItemsSearchName] = useState('');
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsCount, setItemsCount] = useState(10);
  const [itemsSortBy, setItemsSortBy] = useState(GetItemsSortBy.Name);
  const [itemsSortOrder, setItemsSortOrder] = useState(SortOrder.Asc);

  enum OpenModal {
    None,
    Add,
    Edit,
    Delete,
  }
  const [openModal, setOpenModal] = useState(OpenModal.None);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>();

  const user = useSelector((state: AppState) => state.auth.user);

  const totalItemCount = useSelector(
    (state: AppState) => state.items.totalCount,
  );
  const items = useSelector((state: AppState) => state.items.items);
  const getItemsError = useSelector(
    (state: AppState) => state.items.getItems.error,
  );

  const dispatch = useDispatch();

  // Effects & Callbacks

  const getItems = useCallback((): void => {
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
    setIsAdmin(user?.roles?.includes(UserRole.Admin) ?? false);
  }, [user]);

  useEffect(() => {
    getItems();
  }, [getItems]);

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

  const handleSearch = ({
    searchString,
  }: {
    searchKey?: string;
    searchString: string;
  }): void => {
    setItemsSearchName(searchString);
  };

  const handleClickAdd = (): void => {
    setOpenModal(OpenModal.Add);
  };

  const handleAdd = (): void => {
    getItems();
    setOpenModal(OpenModal.None);
  };

  const handleClickEdit = (id: string): void => {
    setOpenModal(OpenModal.Edit);
    setSelectedItem(items.find((item) => item.id === id));
  };

  const handleEdit = (): void => {
    getItems();
    setOpenModal(OpenModal.None);
    setSelectedItem(undefined);
  };

  const handleClickDelete = (id: string): void => {
    setOpenModal(OpenModal.Delete);
    setSelectedItem(items.find((item) => item.id === id));
  };

  const handleDelete = (): void => {
    if (itemsPage > 1 && items.length === 1) {
      setItemsPage(itemsPage - 1);
    } else {
      getItems();
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

        <div className="flex w-full flex-row items-center justify-between pb-6">
          <span className="pl-4 text-4xl font-bold">Tradable Items</span>
          <div className="flex space-x-4 pr-2">
            {isAdmin && (
              <div className="w-24">
                <PrimaryButton value="+ Add" onClick={handleClickAdd} />
              </div>
            )}
            <Search onSearch={handleSearch} isAutoSearchAllowed />
          </div>
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
            onEdit={isAdmin ? handleClickEdit : undefined}
            onDelete={isAdmin ? handleClickDelete : undefined}
          />
        </div>
      </div>

      {isAdmin &&
        ((): JSX.Element | undefined => {
          switch (openModal) {
            case OpenModal.Add:
              return (
                <AddItemModal onAdd={handleAdd} onClose={handleCloseModal} />
              );
            case OpenModal.Edit:
              if (selectedItem) {
                return (
                  <EditItemModal
                    item={selectedItem}
                    onEdit={handleEdit}
                    onClose={handleCloseModal}
                  />
                );
              }
              break;
            case OpenModal.Delete:
              if (selectedItem) {
                return (
                  <DeleteItemModal
                    item={selectedItem}
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

export default Items;
