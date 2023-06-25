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
  UpdateUserWishDto,
  updateUserWishValidator,
} from '../dtos/update-user-wish.dto';
import {
  resetUserWishesState,
  updateUserWishRequest,
} from '../redux/user-wishes.slice';
import { UserWish } from '../schemas/user-wish';

interface Props {
  userWish: UserWish;
  onEdit: () => void;
  onClose: () => void;
}

export const EditUserWishModal: FC<Props> = ({ userWish, onEdit, onClose }) => {
  // Properties

  const isUpdateUserWishTriggered = useSelector(
    (state: AppState) => state.userWishes.updateUserWish.isTriggered,
  );
  const isUpdateUserWishLoading = useSelector(
    (state: AppState) => state.userWishes.updateUserWish.isLoading,
  );
  const updateUserWishError = useSelector(
    (state: AppState) => state.userWishes.updateUserWish.error,
  );

  const dispatch = useDispatch();

  const onEditCallback = useCallback(onEdit, [onEdit]);

  // Effects

  useEffect(() => {
    if (!isUpdateUserWishTriggered || isUpdateUserWishLoading) {
      return;
    }

    if (!updateUserWishError) {
      onEditCallback();

      dispatch(
        addToastMessage({
          type: ToastType.Info,
          message: 'Wish successfully updated',
        }),
      );
    } else {
      dispatch(
        addToastMessage({
          type: ToastType.Error,
          message: `Failed to update wish: ${
            (updateUserWishError.response?.data as { message?: string })
              ?.message ?? updateUserWishError.message
          }`,
        }),
      );
    }
    dispatch(resetUserWishesState({ updateUserWish: true }));
  }, [
    isUpdateUserWishTriggered,
    isUpdateUserWishLoading,
    updateUserWishError,
    dispatch,
    onEditCallback,
  ]);

  // Handlers

  const handleEdit = ({ remarks }: UpdateUserWishDto): void => {
    const payload: UpdateUserWishDto = {
      id: userWish.id,
    };
    if (remarks !== userWish.remarks) {
      payload.remarks = remarks;
    }

    dispatch(updateUserWishRequest(payload));
  };

  const handleClose = (): void => {
    onClose();
  };

  // Elements

  return (
    <Modal title="Edit wish" onPressEscape={handleClose}>
      <Formik
        initialValues={{
          id: '',
          remarks: userWish.remarks,
        }}
        validationSchema={updateUserWishValidator}
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
                  value={userWish.item?.name}
                  disabled
                />

                <LabelledTextArea
                  id="itemDescription"
                  label="Description"
                  rows={4}
                  value={userWish.item?.description}
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
                  value={isUpdateUserWishLoading ? 'Editing...' : 'Edit'}
                  disabled={isUpdateUserWishLoading}
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
