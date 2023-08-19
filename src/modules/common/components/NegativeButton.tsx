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
      className={`w-full cursor-pointer rounded-full bg-negative-primary px-3 py-2 font-semibold text-negative-secondary hover:bg-negative-hovered-primary hover:text-negative-hovered-secondary disabled:cursor-auto disabled:bg-button-disabled-primary disabled:text-button-disabled-secondary ${className}`}
      type={type}
      {...rest}
    />
  );
};
