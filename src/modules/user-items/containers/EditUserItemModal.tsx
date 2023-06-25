import { Formik } from 'formik';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { LabelledTextArea } from '@app/modules/common/components/LabelledTextArea';
import { LabelledTextBox } from '@app/modules/common/components/LabelledTextBox';
import { Modal } from '@app/modules/common/components/Modal';
import { PrimaryButton } from '@app/modules/common/components/PrimaryButton';
import { SecondaryButton } from '@app/modules/common/components/SecondaryButton';
import {
  addToastMessage,
  ToastType,
} from '@app/modules/common/redux/toast.slice';
import { AppState } from '@app/redux/store';

import {
  UpdateUserItemDto,
  updateUserItemValidator,
} from '../dtos/update-user-item.dto';
import {
  resetUserItemsState,
  updateUserItemRequest,
} from '../redux/user-items.slice';
import { UserItem } from '../schemas/user-item';

interface Props {
  userItem: UserItem;
  onEdit: () => void;
  onClose: () => void;
}

export const EditUserItemModal: FC<Props> = ({ userItem, onEdit, onClose }) => {
  // Properties

  const isUpdateUserItemTriggered = useSelector(
    (state: AppState) => state.userItems.updateUserItem.isTriggered,
  );
  const isUpdateUserItemLoading = useSelector(
    (state: AppState) => state.userItems.updateUserItem.isLoading,
  );
  const updateUserItemError = useSelector(
    (state: AppState) => state.userItems.updateUserItem.error,
  );

  const dispatch = useDispatch();

  const onEditCallback = useCallback(onEdit, [onEdit]);

  // Effects

  useEffect(() => {
    if (!isUpdateUserItemTriggered || isUpdateUserItemLoading) {
      return;
    }

    if (!updateUserItemError) {
      onEditCallback();

      dispatch(
        addToastMessage({
          type: ToastType.Info,
          message: 'Item successfully updated',
        }),
      );
    } else {
      dispatch(
        addToastMessage({
          type: ToastType.Error,
          message: `Failed to update item: ${
            (updateUserItemError.response?.data as { message?: string })
              ?.message ?? updateUserItemError.message
          }`,
        }),
      );
    }
    dispatch(resetUserItemsState({ updateUserItem: true }));
  }, [
    isUpdateUserItemTriggered,
    isUpdateUserItemLoading,
    updateUserItemError,
    dispatch,
    onEditCallback,
  ]);

  // Handlers

  const handleEdit = ({ remarks }: UpdateUserItemDto): void => {
    const payload: UpdateUserItemDto = {
      id: userItem.id,
    };
    if (remarks !== userItem.remarks) {
      payload.remarks = remarks;
    }

    dispatch(updateUserItemRequest(payload));
  };

  const handleClose = (): void => {
    onClose();
  };

  // Elements

  return (
    <Modal title="Edit item" onPressEscape={handleClose}>
      <Formik
        initialValues={{
          id: '',
          remarks: userItem.remarks,
        }}
        validationSchema={updateUserItemValidator}
        onSubmit={handleEdit}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleBlur,
          handleChange,
        }): JSX.Element => {
          return (
            <form onSubmit={handleSubmit}>
              <div className="relative space-y-6">
                <LabelledTextBox
                  className=""
                  list="itemNameAutocomplete"
                  id="itemName"
                  label="Name"
                  type="text"
                  value={userItem.item?.name}
                  disabled
                />

                <LabelledTextArea
                  id="itemDescription"
                  label="Description"
                  rows={4}
                  value={userItem.item?.description}
                  disabled
                />

                <LabelledTextArea
                  id="remarks"
                  label="Remarks"
                  rows={4}
                  hasError={!!errors.remarks && touched.remarks}
                  error={errors.remarks}
                  value={values.remarks}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>

              <div className="mt-8 flex flex-row-reverse space-x-4 space-x-reverse">
                <PrimaryButton
                  value={isUpdateUserItemLoading ? 'Editing...' : 'Edit'}
                  disabled={isUpdateUserItemLoading}
                />
                <SecondaryButton value="Cancel" onClick={handleClose} />
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};
