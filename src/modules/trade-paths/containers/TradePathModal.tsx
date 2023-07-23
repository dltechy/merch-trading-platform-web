import { FC } from 'react';

import { Card } from '@app/modules/common/components/Card';
import { Modal } from '@app/modules/common/components/Modal';
import { PrimaryButton } from '@app/modules/common/components/PrimaryButton';
import { UserItem } from '@app/modules/user-items/schemas/user-item';

interface Props {
  tradePath: UserItem[];
  onClose: () => void;
}

export const TradePathModal: FC<Props> = ({ tradePath, onClose }) => {
  // Handlers

  const handleClose = (): void => {
    onClose();
  };

  // Elements

  const renderItemCard: (userItem: UserItem) => JSX.Element = (userItem) => (
    <Card
      className="flex w-full flex-col bg-blue-100 px-6 py-4"
      title={`${userItem.item?.name ?? ''}\n\n${userItem.remarks}\n\nOwner: ${
        userItem.user?.displayName
      }`}
    >
      <span className="line-clamp-2 whitespace-pre-wrap break-words text-xl font-bold">
        {userItem.item?.name}
      </span>
      <span className="line-clamp-2 whitespace-pre-wrap break-words pl-6 font-normal">
        {userItem.remarks}
      </span>
      <div className="truncate">
        <span className="pl-6 font-bold italic">Owner: </span>
        <span className="font-normal italic">{userItem.user?.displayName}</span>
      </div>
    </Card>
  );

  return (
    <Modal title="Trade Path" onPressEscape={handleClose}>
      <div className="flex h-full flex-col overflow-auto">
        <div className="flex w-full justify-center overflow-auto">
          <div className="flex w-4/5 flex-col items-center space-y-2">
            {renderItemCard(tradePath[0])}
            {tradePath.slice(1).map((userItem, index) => {
              return (
                <>
                  <div className="relative">
                    <span className="absolute left-[50%] w-24 translate-x-[-6rem] font-bold">
                      Trade {index + 1}
                    </span>
                    <span className="-mt-2 block text-2xl">↕</span>
                  </div>
                  {renderItemCard(userItem)}
                </>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex w-full justify-end">
          <div className="w-1/4">
            <PrimaryButton value="Close" onClick={handleClose} />
          </div>
        </div>
      </div>
    </Modal>
  );
};
