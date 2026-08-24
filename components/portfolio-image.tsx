import Image from 'next/image';
import type { ComponentProps } from 'react';

type PortfolioImageProps = Omit<ComponentProps<typeof Image>, 'src' | 'unoptimized'> & {
  src: string;
};

export function PortfolioImage({ src, alt, ...props }: PortfolioImageProps) {
  const isRemote = /^https?:\/\//i.test(src);

  return <Image src={src} alt={alt} unoptimized={isRemote} {...props} />;
}
