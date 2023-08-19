import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';

import { TextBox } from './TextBox';

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
  hasError?: boolean;
  error?: string;
}

export const LabelledTextBox: FC<Props> = ({
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
      <TextBox id={id} className="mt-1" hasError={hasError} {...rest} />
      {hasError && (
        <span className="mt-1 pl-3 text-sm font-normal italic text-negative-primary">
          {error}
        </span>
      )}
    </label>
  );
};
