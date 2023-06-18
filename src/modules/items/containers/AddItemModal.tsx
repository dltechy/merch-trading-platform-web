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

import { CreateItemDto, createItemValidator } from '../dtos/create-item.dto';
import { createItemRequest, resetItemsState } from '../redux/items.slice';

interface Props {
  onAdd: () => void;
  onClose: () => void;
}

export const AddItemModal: FC<Props> = ({ onAdd, onClose }) => {
  // Properties

  const isCreateItemTriggered = useSelector(
    (state: AppState) => state.items.createItem.isTriggered,
  );
  const isCreateItemLoading = useSelector(
    (state: AppState) => state.items.createItem.isLoading,
  );
  const createItemError = useSelector(
    (state: AppState) => state.items.createItem.error,
  );

  const dispatch = useDispatch();

  const onAddCallback = useCallback(onAdd, [onAdd]);

  // Effects

  useEffect(() => {
    if (!isCreateItemTriggered || isCreateItemLoading) {
      return;
    }

    if (!createItemError) {
      onAddCallback();

      dispatch(
        addToastMessage({
          type: ToastType.Info,
          message: 'Item successfully added',
        }),
      );
    } else {
      dispatch(
        addToastMessage({
          type: ToastType.Error,
          message: `Failed to add item: ${
            (createItemError.response?.data as { message?: string })?.message ??
            createItemError.message
          }`,
        }),
      );
    }
    dispatch(resetItemsState({ createItem: true }));
  }, [
    isCreateItemTriggered,
    isCreateItemLoading,
    createItemError,
    dispatch,
    onAddCallback,
  ]);

  // Handlers

  const handleAdd = (dto: CreateItemDto): void => {
    dispatch(createItemRequest(dto));
  };

  const handleClose = (): void => {
    onClose();
  };

  // Elements

  return (
    <Modal title="Add item" onPressEscape={handleClose}>
      <Formik
        initialValues={{
          name: '',
          description: '',
        }}
        validationSchema={createItemValidator}
        onSubmit={handleAdd}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleBlur,
          handleChange,
        }): JSX.Element => (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <LabelledTextBox
                id="name"
                label="Name"
                hasError={!!errors.name && touched.name}
                error={errors.name}
                type="text"
                value={values.name}
                onBlur={handleBlur}
                onChange={handleChange}
              />

              <LabelledTextArea
                id="description"
                label="Description"
                rows={4}
                hasError={!!errors.description && touched.description}
                error={errors.description}
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>

            <div className="mt-8 flex flex-row-reverse space-x-4 space-x-reverse">
              <PrimaryButton
                value={isCreateItemLoading ? 'Adding...' : 'Add'}
                disabled={isCreateItemLoading}
              />
              <SecondaryButton value="Cancel" onClick={handleClose} />
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
};
