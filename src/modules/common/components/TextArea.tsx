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
      className={`w-full rounded-3xl bg-primary font-normal disabled:bg-input-disabled-primary disabled:text-input-disabled-secondary ${className} ${
        hasError ? 'border-2 border-negative-primary' : ''
      }`}
      {...rest}
    />
  );
};
