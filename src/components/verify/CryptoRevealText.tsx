import React from 'react';

interface CryptoRevealTextProps {
  text: string;
  active?: boolean;
  duration?: number;
  className?: string;
  mono?: boolean;
}

export const HEX_CHARS = '0123456789ABCDEFabcdef';

export default function CryptoRevealText({
  text,
  className = '',
  mono = false,
}: CryptoRevealTextProps) {
  return (
    <span
      className={`transition-opacity duration-200 ${
        mono ? 'font-mono' : ''
      } ${className}`}
    >
      {text}
    </span>
  );
}
