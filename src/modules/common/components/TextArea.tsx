import { DetailedHTMLProps, FC, TextareaHTMLAttributes } from 'react';

interface Props
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  hasError?: boolean;
}

export const TextArea: FC<Props> = ({ className = '', hasError, ...rest }) => {
  return (
    <textarea
      className={`w-full rounded-3xl font-normal disabled:bg-gray-200 ${className} ${
        hasError ? 'border-2 border-red-500' : ''
      }`}
      {...rest}
    />
  );
};
