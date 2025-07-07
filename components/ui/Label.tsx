import React from 'react';
import { motion } from 'framer-motion';

interface LabelProps {
  text: string;
  position?: {
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
  };
  targetRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

const Label: React.FC<LabelProps> = ({
  text,
  position = {},
  targetRef,
  className = '',
}) => {
  const { left, top, right, bottom } = position;
  
  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 2,
    left: left || (right ? undefined : '50%'),
    top: top || (bottom ? undefined : '0'),
    right,
    bottom,
    transform: (left === undefined && right === undefined) ? 'translate(-50%, -150%)' : undefined,
    backgroundColor: '#4a5568',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px', // Pill shape
    fontSize: '0.875rem',
    fontWeight: 500,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    whiteSpace: 'nowrap',
  };

  return (
    <motion.div
      className={`label ${className}`}
      style={baseStyles}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {text}
    </motion.div>
  );
};

export default Label;
