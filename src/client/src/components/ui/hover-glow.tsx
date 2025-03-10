import React from 'react';
import { cn } from '@/lib/utils';

type HoverGlowProps = {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'ember';
  className?: string;
};

const colorMap = {
  primary: 'shadow-[0_0_15px_rgba(93,63,211,0.3)] hover:shadow-[0_0_20px_rgba(93,63,211,0.6)]',
  secondary: 'shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.6)]',
  accent: 'shadow-[0_0_15px_rgba(0,128,128,0.3)] hover:shadow-[0_0_20px_rgba(0,128,128,0.6)]',
  ember: 'shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_20px_rgba(255,165,0,0.6)]',
};

export const HoverGlow: React.FC<HoverGlowProps> = ({ 
  children, 
  color = 'primary',
  className
}) => {
  return (
    <div className={cn('transition-all duration-300', colorMap[color], className)}>
      {children}
    </div>
  );
};
