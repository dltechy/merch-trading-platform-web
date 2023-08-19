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
  deleteUserWishRequest,
  resetUserWishesState,
} from '../redux/user-wishes.slice';
import { UserWish } from '../schemas/user-wish';

interface Props {
  userWish: UserWish;
  onDelete: () => void;
  onClose: () => void;
}

export const DeleteUserWishModal: FC<Props> = ({
  userWish,
  onDelete,
  onClose,
}) => {
  // Properties

  const isDeleteUserWishTriggered = useSelector(
    (state: AppState) => state.userWishes.deleteUserWish.isTriggered,
  );
  const isDeleteUserWishLoading = useSelector(
    (state: AppState) => state.userWishes.deleteUserWish.isLoading,
  );
  const deleteUserWishError = useSelector(
    (state: AppState) => state.userWishes.deleteUserWish.error,
  );

  const dispatch = useDispatch();

  // Effects

  useEffect(() => {
    if (!isDeleteUserWishTriggered || isDeleteUserWishLoading) {
      return;
    }

    if (!deleteUserWishError) {
      onDelete();

      dispatch(
        addToastMessage({
          type: ToastType.Info,
          message: 'Wish successfully deleted',
        }),
      );
    } else {
      dispatch(
        addToastMessage({
          type: ToastType.Error,
          message: `Failed to delete wish: ${
            (deleteUserWishError.response?.data as { message?: string })
              ?.message ?? deleteUserWishError.message
          }`,
        }),
      );
    }
    dispatch(resetUserWishesState({ deleteUserWish: true }));
  }, [
    isDeleteUserWishTriggered,
    isDeleteUserWishLoading,
    deleteUserWishError,
    dispatch,
    onDelete,
  ]);

  // Handlers

  const handleDelete = (): void => {
    dispatch(
      deleteUserWishRequest({
        id: userWish.id,
      }),
    );
  };

  const handleClose = (): void => {
    onClose();
  };

  // Elements

  return (
    <Modal title="Delete wish" onPressEscape={handleClose}>
      <div className="flex flex-col px-6">
        <span>Are you sure you want to delete this wish?</span>
        <span className="px-6 font-bold">{`"${userWish.item?.name}"`}</span>
      </div>

      <div className="mt-8 flex flex-row-reverse space-x-4 space-x-reverse">
        <PrimaryButton
          value={isDeleteUserWishLoading ? 'Deleting...' : 'Delete'}
          onClick={handleDelete}
          disabled={isDeleteUserWishLoading}
        />
        <CancelButton value="Cancel" onClick={handleClose} />
      </div>
    </Modal>
  );
};
