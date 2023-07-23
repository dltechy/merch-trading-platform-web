import { DetailedHTMLProps, FC, HTMLAttributes } from 'react';

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const Card: FC<Props> = ({ className = '', children, ...rest }) => {
  return (
    <div className={`rounded-3xl border-2 border-black ${className}`} {...rest}>
      {children}
    </div>
  );
};
