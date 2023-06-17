import { DetailedHTMLProps, FC, SelectHTMLAttributes } from 'react';

interface Props
  extends DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  values: (string | number)[];
  selectedValue: string | number;
}

export const Dropdown: FC<Props> = ({
  id,
  values,
  selectedValue,
  className = '',
  ...rest
}) => {
  return (
    <select
      id={id}
      name={id}
      className={`w-full rounded-full ${className}`}
      value={selectedValue}
      {...rest}
    >
      {values.map((value) => {
        return (
          <option key={value} value={value}>
            {value}
          </option>
        );
      })}
    </select>
  );
};
