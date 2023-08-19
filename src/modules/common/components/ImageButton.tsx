import { ButtonHTMLAttributes, DetailedHTMLProps, FC, SVGProps } from 'react';

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  SvgImage: FC<SVGProps<SVGSVGElement>>;
}

export const ImageButton: FC<Props> = ({ SvgImage, className, ...rest }) => {
  return (
    <button
      className={className ?? 'h-8 w-8 rounded-full p-1.5 hover:bg-blue-400'}
      type="button"
      {...rest}
    >
      <SvgImage className="h-full w-full cursor-pointer" />
    </button>
  );
};
