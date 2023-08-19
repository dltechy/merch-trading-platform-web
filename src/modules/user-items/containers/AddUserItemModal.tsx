import { Formik, FormikErrors, FormikHelpers } from 'formik';
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { debounce } from '@app/helpers/timers/debounce.helper';
import { CancelButton } from '@app/modules/common/components/CancelButton';
import { LabelledTextArea } from '@app/modules/common/components/LabelledTextArea';
import { LabelledTextBox } from '@app/modules/common/components/LabelledTextBox';
import { Modal } from '@app/modules/common/components/Modal';
import { PrimaryButton } from '@app/modules/common/components/PrimaryButton';
import {
  addToastMessage,
  ToastType,
} from '@app/modules/common/redux/toast.slice';
import { CreateItemDto } from '@app/modules/items/dtos/create-item.dto';
import { GetItemsSortBy } from '@app/modules/items/dtos/get-items.dto';
import { getItemsRequest } from '@app/modules/items/redux/items.slice';
import { Item } from '@app/modules/items/schemas/item';
import { AppState } from '@app/redux/store';

import {
  CreateUserItemDto,
  CreateUserItemFormData,
  createUserItemValidator,
} from '../dtos/create-user-item.dto';
import {
  createUserItemRequest,
  resetUserItemsState,
} from '../redux/user-items.slice';

interface Props {
  onAdd: () => void;
  onClose: () => void;
}

export const AddUserItemModal: FC<Props> = ({ onAdd, onClose }) => {
  // Properties

  const [isItemNameFocused, setIsItemNameFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const items = useSelector((state: AppState) => state.items.items);
  const isGetItemsLoading = useSelector(
    (state: AppState) => state.items.getItems.isLoading,
  );
  const getItemsError = useSelector(
    (state: AppState) => state.items.getItems.error,
  );

  const isCreateUserItemTriggered = useSelector(
    (state: AppState) => state.userItems.createUserItem.isTriggered,
  );
  const isCreateUserItemLoading = useSelector(
    (state: AppState) => state.userItems.createUserItem.isLoading,
  );
  const createUserItemError = useSelector(
    (state: AppState) => state.userItems.createUserItem.error,
  );

  const dispatch = useDispatch();

  let formValues: CreateUserItemFormData | undefined;
  let setFormFieldValue:
    | FormikHelpers<FormikErrors<object>>['setFieldValue']
    | undefined;

  const onAddCallback = useCallback(onAdd, [onAdd]);

  const debouncedGetItemsRequest = useMemo(() => {
    return debounce((e: ChangeEvent<HTMLInputElement>) => {
      dispatch(
        getItemsRequest({
          searchName: e.target.value.trim(),
          count: 10,
          sortBy: GetItemsSortBy.Name,
        }),
      );
    });
  }, [dispatch]);

  // Effects

  useEffect(() => {
    if (!isGetItemsLoading || getItemsError) {
      return;
    }

    const foundItem = items.find(
      (item) =>
        item.name.toLowerCase() === formValues?.itemName.trim().toLowerCase(),
    );
    if (foundItem) {
      setSelectedItem(foundItem);

      if (!isItemNameFocused && selectedItem) {
        setFormFieldValue?.('itemName', selectedItem.name);
      }
    }
  }, [
    items,
    isGetItemsLoading,
    getItemsError,
    formValues?.itemName,
    setFormFieldValue,
    selectedItem,
    isItemNameFocused,
  ]);

  useEffect(() => {
    if (!isCreateUserItemTriggered || isCreateUserItemLoading) {
      return;
    }

    if (!createUserItemError) {
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
            (createUserItemError.response?.data as { message?: string })
              ?.message ?? createUserItemError.message
          }`,
        }),
      );
    }
    dispatch(resetUserItemsState({ createUserItem: true }));
  }, [
    isCreateUserItemTriggered,
    isCreateUserItemLoading,
    createUserItemError,
    dispatch,
    onAddCallback,
  ]);

  // Handlers

  const handleChangeItemName = (e: ChangeEvent<HTMLInputElement>): void => {
    setSelectedItem(null);

    debouncedGetItemsRequest(500, e);
  };

  const handleBlurItemName = async (): Promise<void> => {
    setIsItemNameFocused(false);

    if (selectedItem) {
      setFormFieldValue?.('itemName', selectedItem.name);
    }
  };

  const handleAdd = ({
    itemName,
    itemDescription,
    remarks,
  }: CreateUserItemFormData): void => {
    let createItemDto: CreateItemDto | undefined;
    if (!selectedItem) {
      createItemDto = {
        name: itemName,
        description: itemDescription,
      };
    }

    const createUserItemDto: CreateUserItemDto = {
      itemId: selectedItem?.id ?? '',
      remarks,
      itemModifierIds: [],
    };

    dispatch(
      createUserItemRequest({
        createItemDto,
        createUserItemDto,
      }),
    );
  };

  const handleClose = (): void => {
    onClose();
  };

  // Elements

  return (
    <Modal title="Add item" onPressEscape={handleClose}>
      <Formik
        initialValues={{
          itemName: '',
          itemDescription: '',
          remarks: '',
        }}
        validationSchema={createUserItemValidator}
        onSubmit={handleAdd}
      >
        {({
          values,
          errors,
          touched,
          handleSubmit,
          handleBlur,
          handleChange,
          setFieldValue,
        }): JSX.Element => {
          formValues = values;
          setFormFieldValue = setFieldValue;

          return (
            <form onSubmit={handleSubmit}>
              <div className="relative space-y-6">
                <LabelledTextBox
                  className=""
                  list="itemNameAutocomplete"
                  id="itemName"
                  label="Name"
                  hasError={!!errors.itemName && touched.itemName}
                  error={errors.itemName}
                  type="text"
                  value={values.itemName}
                  onFocus={(): void => setIsItemNameFocused(true)}
                  onBlur={(e): void => {
                    handleBlur(e);
                    handleBlurItemName();
                  }}
                  onChange={(e): void => {
                    handleChange(e);
                    handleChangeItemName(e);
                  }}
                />

                <datalist id="itemNameAutocomplete">
                  {items.map((item) => {
                    return <option key={item.id}>{item.name}</option>;
                  })}
                </datalist>

                <LabelledTextArea
                  id="itemDescription"
                  label={`Description (${
                    selectedItem ? 'Existing' : 'New'
                  } Item)`}
                  rows={4}
                  hasError={!!errors.itemDescription && touched.itemDescription}
                  error={errors.itemDescription}
                  value={selectedItem?.description ?? values.itemDescription}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!!selectedItem}
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
                  value={isCreateUserItemLoading ? 'Adding...' : 'Add'}
                  disabled={isGetItemsLoading || isCreateUserItemLoading}
                />
                <CancelButton value="Cancel" onClick={handleClose} />
              </div>
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
};
