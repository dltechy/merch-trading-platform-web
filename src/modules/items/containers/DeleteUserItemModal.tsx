import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CancelButton } from '@app/modules/common/components/CancelButton';
import { Modal } from '@app/modules/common/components/Modal';
import { PrimaryButton } from '@app/modules/common/components/PrimaryButton';
import {
  addToastMessage,
  ToastType,
} from '@app/modules/common/redux/toast.slice';
import { AppState } from '@app/redux/store';

import { deleteItemRequest, resetItemsState } from '../redux/items.slice';
import { Item } from '../schemas/item';

interface Props {
  item: Item;
  onDelete: () => void;
  onClose: () => void;
}

export const DeleteItemModal: FC<Props> = ({ item, onDelete, onClose }) => {
  // Properties

  const isDeleteItemTriggered = useSelector(
    (state: AppState) => state.items.deleteItem.isTriggered,
  );
  const isDeleteItemLoading = useSelector(
    (state: AppState) => state.items.deleteItem.isLoading,
  );
  const deleteItemError = useSelector(
    (state: AppState) => state.items.deleteItem.error,
  );

  const dispatch = useDispatch();

  // Effects

  useEffect(() => {
    if (!isDeleteItemTriggered || isDeleteItemLoading) {
      return;
    }

    if (!deleteItemError) {
      onDelete();

      dispatch(
        addToastMessage({
          type: ToastType.Info,
          message: 'Item successfully deleted',
        }),
      );
    } else {
      dispatch(
        addToastMessage({
          type: ToastType.Error,
          message: `Failed to delete item: ${
            (deleteItemError.response?.data as { message?: string })?.message ??
            deleteItemError.message
          }`,
        }),
      );
    }
    dispatch(resetItemsState({ deleteItem: true }));
  }, [
    isDeleteItemTriggered,
    isDeleteItemLoading,
    deleteItemError,
    dispatch,
    onDelete,
  ]);

  // Handlers

  const handleDelete = (): void => {
    dispatch(
      deleteItemRequest({
        id: item.id,
      }),
    );
  };

  const handleClose = (): void => {
    onClose();
  };

  // Elements

  return (
    <Modal title="Delete item" onPressEscape={handleClose}>
      <div className="flex flex-col px-6">
        <span>Are you sure you want to delete this item?</span>
        <span className="px-6 font-bold">{`"${item.name}"`}</span>
      </div>

      <div className="mt-8 flex flex-row-reverse space-x-4 space-x-reverse">
        <PrimaryButton
          value={isDeleteItemLoading ? 'Deleting...' : 'Delete'}
          onClick={handleDelete}
          disabled={isDeleteItemLoading}
        />
        <CancelButton value="Cancel" onClick={handleClose} />
      </div>
    </Modal>
  );
};
