import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  isOpen: boolean;
  onClose: () => void;
  emojis: string[];
  position?: {
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
  };
  triggerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  isOpen,
  onClose,
  emojis,
  position = {},
  triggerRef,
  className = '',
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { left, top, right, bottom } = position;
  
  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current && 
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef?.current && 
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10,
    left: left || (right ? undefined : '50%'),
    top: top || (bottom ? undefined : '120%'),
    right,
    bottom,
    transform: (left === undefined && right === undefined) ? 'translateX(-50%)' : undefined,
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    maxWidth: '200px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={tooltipRef}
          className={`tooltip ${className}`}
          style={baseStyles}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {emojis.map((emoji, index) => (
            <div 
              key={index} 
              className="tooltip-emoji"
              style={{ fontSize: '1.5rem', cursor: 'default' }}
            >
              {emoji}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Tooltip;
