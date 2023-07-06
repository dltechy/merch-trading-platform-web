import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';
import { FC } from 'react';

interface Props {
  href: Url;
  text: string;
  isSelected?: boolean;
}

export const SidebarTab: FC<Props> = ({ href, text, isSelected }) => {
  return (
    <Link href={href}>
      <div
        className={`flex w-full items-center hover:bg-cyan-600 ${
          isSelected ? 'bg-cyan-400 text-black' : 'text-white hover:text-black'
        }`}
      >
        <div className="flex h-12 items-center px-4 font-semibold">
          <span className="font-semibold">{text}</span>
        </div>
      </div>
    </Link>
  );
};
