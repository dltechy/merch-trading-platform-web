import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  hasError?: boolean;
}

export const TextBox: FC<Props> = ({ className = '', hasError, ...rest }) => {
  return (
    <input
      className={`w-full rounded-full font-normal disabled:bg-gray-200 ${className} ${
        hasError ? 'border-2 border-red-500' : ''
      }`}
      {...rest}
    />
  );
};
