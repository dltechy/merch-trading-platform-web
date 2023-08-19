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
      className={`w-full rounded-full bg-primary font-normal disabled:bg-input-disabled-primary disabled:text-input-disabled-secondary ${className} ${
        hasError ? 'border-2 border-negative-primary' : ''
      }`}
      {...rest}
    />
  );
};
