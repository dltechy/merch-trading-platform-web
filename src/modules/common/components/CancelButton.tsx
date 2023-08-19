import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

export const CancelButton: FC<Props> = ({
  className = '',
  type = 'button',
  ...rest
}) => {
  return (
    <input
      className={`w-full cursor-pointer rounded-full bg-button-cancel-primary p-2 font-semibold text-button-cancel-secondary hover:bg-button-cancel-hovered-primary hover:text-button-cancel-hovered-secondary disabled:cursor-auto disabled:text-button-disabled-secondary ${className}`}
      type={type}
      {...rest}
    />
  );
};
