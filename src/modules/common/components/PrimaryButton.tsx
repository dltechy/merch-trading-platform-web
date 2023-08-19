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
      className={`w-full cursor-pointer rounded-full bg-button-primary px-3 py-2 font-semibold text-button-secondary hover:bg-button-hovered-primary hover:text-button-hovered-secondary disabled:cursor-auto disabled:bg-button-disabled-primary disabled:text-button-disabled-secondary ${className}`}
      type={type}
      {...rest}
    />
  );
};
