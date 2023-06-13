import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const SecondaryButton: FC<Props> = ({
  className = '',
  type = 'button',
  ...rest
}) => {
  return (
    <input
      className={`w-full cursor-pointer rounded-full bg-gray-200 p-2 font-semibold hover:bg-gray-300 disabled:cursor-auto disabled:text-gray-400 ${className}`}
      type={type}
      {...rest}
    />
  );
};
