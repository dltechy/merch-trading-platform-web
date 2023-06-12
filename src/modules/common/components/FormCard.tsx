import { FC, ReactNode } from 'react';

interface Props {
  title?: string;
  className?: string;
  children?: ReactNode;
}

export const FormCard: FC<Props> = ({ title, className = '', children }) => {
  return (
    <div className={`rounded-3xl border-2 bg-white px-6 py-8 ${className}`}>
      {title && <h1 className="mb-6 text-4xl font-bold">{title}</h1>}

      {children}
    </div>
  );
};
