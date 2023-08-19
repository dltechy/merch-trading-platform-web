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

import {
  deleteUserItemRequest,
  resetUserItemsState,
} from '../redux/user-items.slice';
import { UserItem } from '../schemas/user-item';

interface Props {
  userItem: UserItem;
  onDelete: () => void;
  onClose: () => void;
}

export const DeleteUserItemModal: FC<Props> = ({
  userItem,
  onDelete,
  onClose,
}) => {
  // Properties

  const isDeleteUserItemTriggered = useSelector(
    (state: AppState) => state.userItems.deleteUserItem.isTriggered,
  );
  const isDeleteUserItemLoading = useSelector(
    (state: AppState) => state.userItems.deleteUserItem.isLoading,
  );
  const deleteUserItemError = useSelector(
    (state: AppState) => state.userItems.deleteUserItem.error,
  );

  const dispatch = useDispatch();

  // Effects

  useEffect(() => {
    if (!isDeleteUserItemTriggered || isDeleteUserItemLoading) {
      return;
    }

    if (!deleteUserItemError) {
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
            (deleteUserItemError.response?.data as { message?: string })
              ?.message ?? deleteUserItemError.message
          }`,
        }),
      );
    }
    dispatch(resetUserItemsState({ deleteUserItem: true }));
  }, [
    isDeleteUserItemTriggered,
    isDeleteUserItemLoading,
    deleteUserItemError,
    dispatch,
    onDelete,
  ]);

  // Handlers

  const handleDelete = (): void => {
    dispatch(
      deleteUserItemRequest({
        id: userItem.id,
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
        <span className="px-6 font-bold">{`"${userItem.item?.name}"`}</span>
      </div>

      <div className="mt-8 flex flex-row-reverse space-x-4 space-x-reverse">
        <PrimaryButton
          value={isDeleteUserItemLoading ? 'Deleting...' : 'Delete'}
          onClick={handleDelete}
          disabled={isDeleteUserItemLoading}
        />
        <CancelButton value="Cancel" onClick={handleClose} />
      </div>
    </Modal>
  );
};
