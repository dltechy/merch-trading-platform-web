import { DetailedHTMLProps, FC, TextareaHTMLAttributes } from 'react';

import { TextArea } from './TextArea';

interface Props
  extends DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string;
  hasError?: boolean;
  error?: string;
}

export const LabelledTextArea: FC<Props> = ({
  id,
  className = '',
  label,
  hasError,
  error,
  ...rest
}) => {
  return (
    <label htmlFor={id} className={`block font-semibold ${className}`}>
      <span>{label}</span>
      <TextArea id={id} className="mt-1" hasError={hasError} {...rest} />
      {hasError && (
        <span className="mt-1 pl-3 text-sm font-normal italic text-negative-primary">
          {error}
        </span>
      )}
    </label>
  );
};
