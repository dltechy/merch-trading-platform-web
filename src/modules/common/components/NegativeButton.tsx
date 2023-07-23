import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const NegativeButton: FC<Props> = ({
  className = '',
  type = 'button',
  ...rest
}) => {
  return (
    <input
      className={`w-full cursor-pointer rounded-full bg-red-500 px-3 py-2 font-semibold text-white hover:bg-red-600 disabled:cursor-auto disabled:bg-gray-200 disabled:text-gray-400 ${className}`}
      type={type}
      {...rest}
    />
  );
};
