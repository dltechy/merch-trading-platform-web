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
        className={`flex h-full items-center hover:bg-cyan-600 ${
          isSelected ? 'bg-cyan-400 text-black' : 'text-white hover:text-black'
        }`}
      >
        <div className="flex h-3/4 items-center border-x-2 border-cyan-400 px-3 py-2">
          <div className="w-28 text-center font-semibold">{text}</div>
        </div>
      </div>
    </Link>
  );
};
