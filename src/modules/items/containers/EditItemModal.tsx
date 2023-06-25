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

import { UpdateItemDto, updateItemValidator } from '../dtos/update-item.dto';
import { resetItemsState, updateItemRequest } from '../redux/items.slice';
import { Item } from '../schemas/item';

interface Props {
  item: Item;
  onEdit: () => void;
  onClose: () => void;
}

export const EditItemModal: FC<Props> = ({ item, onEdit, onClose }) => {
  // Properties

  const initialItemName = item.name;
  const initialItemDescription = item.description;

  const isUpdateItemTriggered = useSelector(
    (state: AppState) => state.items.updateItem.isTriggered,
  );
  const isUpdateItemLoading = useSelector(
    (state: AppState) => state.items.updateItem.isLoading,
  );
  const updateItemError = useSelector(
    (state: AppState) => state.items.updateItem.error,
  );

  const dispatch = useDispatch();

  const onEditCallback = useCallback(onEdit, [onEdit]);

  // Effects

  useEffect(() => {
    if (!isUpdateItemTriggered || isUpdateItemLoading) {
      return;
    }

    if (!updateItemError) {
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
            (updateItemError.response?.data as { message?: string })?.message ??
            updateItemError.message
          }`,
        }),
      );
    }
    dispatch(resetItemsState({ updateItem: true }));
  }, [
    isUpdateItemTriggered,
    isUpdateItemLoading,
    updateItemError,
    dispatch,
    onEditCallback,
  ]);

  // Handlers

  const handleEdit = ({ id: _id, name, description }: UpdateItemDto): void => {
    const dto: UpdateItemDto = {
      id: item.id,
    };
    if (name !== initialItemName) {
      dto.name = name;
    }
    if (description !== initialItemDescription) {
      dto.description = description;
    }

    dispatch(updateItemRequest(dto));
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
          name: item.name,
          description: item.description,
        }}
        validationSchema={updateItemValidator}
        onSubmit={handleEdit}
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
                value={isUpdateItemLoading ? 'Editing...' : 'Edit'}
                disabled={isUpdateItemLoading}
              />
              <SecondaryButton value="Cancel" onClick={handleClose} />
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
};
