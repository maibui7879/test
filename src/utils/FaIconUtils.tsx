// src/components/FaIcon.tsx
import React from 'react';
import { IconType } from 'react-icons';

interface FaIconProps extends React.SVGProps<SVGSVGElement> {
  icon: IconType;
  className?: string;
}

const FaIconUtils: React.FC<FaIconProps> = ({ icon: Icon, className, ...props }) => {
  const IconComponent = Icon as React.FC<React.SVGProps<SVGSVGElement>>;
  return <IconComponent className={className} {...props} />;
};

export default FaIconUtils;
