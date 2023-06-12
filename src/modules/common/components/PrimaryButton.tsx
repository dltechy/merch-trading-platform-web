import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const PrimaryButton: FC<Props> = ({
  className = '',
  type = 'submit',
  ...rest
}) => {
  return (
    <input
      className={`w-full cursor-pointer rounded-full bg-blue-500 px-3 py-2 font-semibold text-white hover:bg-blue-600 disabled:cursor-auto disabled:bg-gray-200 disabled:text-gray-400 ${className}`}
      type={type}
      {...rest}
    />
  );
};
