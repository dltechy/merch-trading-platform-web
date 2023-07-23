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
import { AddItemModal } from '@app/modules/items/containers/AddItemModal';
import { EditItemModal } from '@app/modules/items/containers/EditItemModal';
import { GetItemsSortBy } from '@app/modules/items/dtos/get-items.dto';
import {
  getItemsRequest,
  resetItemsState,
} from '@app/modules/items/redux/items.slice';
import { Item } from '@app/modules/items/schemas/item';
import { AppState } from '@app/redux/store';

const Items: NextPage = () => {
  // Properties

  const appName = process.env.NEXT_PUBLIC_APP_NAME;

  const [itemsSearchName, setItemsSearchName] = useState('');
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsCount, setItemsCount] = useState(10);

  enum OpenModal {
    None,
    Add,
    Edit,
  }
  const [openModal, setOpenModal] = useState(OpenModal.None);
  const [selectedItem, setSelectedItem] = useState<Item | undefined>();

  const isAdmin = useSelector((state: AppState) => state.auth.isAdmin);

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
        sortBy: GetItemsSortBy.Name,
        sortOrder: SortOrder.Asc,
      }),
    );
  }, [itemsSearchName, itemsPage, itemsCount, dispatch]);

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
      <div className="flex h-full w-full flex-col items-start justify-center px-4 pb-4 pt-1 md:p-8">
        <Head>
          <title>{`${appName} - Item Descriptions`}</title>
        </Head>

        <div className="flex w-full items-center justify-between pb-2 max-md:flex-col max-md:space-y-2 md:items-start md:pb-6">
          <span className="text-center text-4xl font-bold md:pl-4">
            Item Descriptions
          </span>
          <div className="flex space-x-4 px-2">
            {isAdmin && (
              <div className="w-24">
                <PrimaryButton value="+ Add" onClick={handleClickAdd} />
              </div>
            )}
            <Search onSearch={handleSearch} isAutoSearchAllowed />
          </div>
        </div>
        <div className="h-0 w-full grow-[1]">
          <CardGrid
            totalCount={totalItemCount}
            data={items.map((item) => {
              return {
                key: item.id,
                title: `${item.name}${
                  item.description ? `\n\n${item.description}` : ''
                }`,
                node: (
                  <>
                    <span className="line-clamp-2 whitespace-pre-wrap break-words text-xl font-bold">
                      {item.name}
                    </span>
                    <span className="line-clamp-2 whitespace-pre-wrap break-words pl-6 font-normal">
                      {item.description}
                    </span>
                  </>
                ),
              };
            })}
            page={itemsPage}
            count={itemsCount}
            onSelectCard={handleClickEdit}
            onSelectPage={handleSelectPage}
            onSelectCount={handleSelectCount}
          />
        </div>
      </div>

      {((): JSX.Element | undefined => {
        switch (openModal) {
          case OpenModal.Add:
            if (isAdmin) {
              return (
                <AddItemModal onAdd={handleAdd} onClose={handleCloseModal} />
              );
            }
            break;
          case OpenModal.Edit:
            if (selectedItem) {
              return (
                <EditItemModal
                  isAdmin={isAdmin}
                  item={selectedItem}
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

export default Items;
