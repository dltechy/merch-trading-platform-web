import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';
import { FC } from 'react';

interface Props {
  href: Url;
  text: string;
  isSelected?: boolean;
}

export const HeaderTab: FC<Props> = ({ href, text, isSelected }) => {
  return (
    <Link href={href}>
      <div
        className={`flex h-full items-center hover:bg-tab-hovered-primary hover:text-tab-hovered-secondary ${
          isSelected
            ? 'bg-tab-selected-primary text-tab-selected-secondary'
            : 'text-tab-secondary'
        }`}
      >
        <div className="flex h-3/4 items-center border-x-2 border-divider px-3 py-2">
          <span className="w-32 text-center font-semibold">{text}</span>
        </div>
      </div>
    </Link>
  );
};
