import React from 'react';
import { motion } from 'framer-motion';

interface EmojiProps {
  symbol: string;
  size?: string;
  position?: {
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
  };
  onClick?: () => void;
  isClickable?: boolean;
  animate?: boolean;
  className?: string;
  elementRef?: React.RefObject<HTMLDivElement | null> | ((instance: HTMLDivElement | null) => void);
}

const Emoji = React.forwardRef<HTMLDivElement, EmojiProps>((
  {
    symbol,
    size = '4rem',
    position = {},
    onClick,
    isClickable = false,
    animate = false,
    className = '',
    elementRef,
  }, ref
) => {
  const { left, top, right, bottom } = position;
  
  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    fontSize: size,
    zIndex: 1,
    cursor: isClickable ? 'pointer' : 'default',
    left: left || (right ? undefined : '50%'),
    top: top || (bottom ? undefined : '50%'),
    right,
    bottom,
    transform: (left === undefined && right === undefined) || 
              (top === undefined && bottom === undefined) 
              ? 'translate(-50%, -50%)' 
              : undefined,
    // Remove accessibility highlighting
    background: 'transparent',
    border: 'none',
    outline: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const content = (
    <div 
      ref={(node) => {
        // Handle both forwardRef and elementRef
        if (typeof elementRef === 'function') {
          elementRef(node);
        } else if (elementRef && 'current' in elementRef) {
          (elementRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      className={`emoji ${className}`}
      style={baseStyles}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      aria-label={isClickable ? `${symbol} emoji` : undefined}
    >
      {symbol}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        ref={(node) => {
          // Handle both forwardRef and elementRef for motion.div
          if (node) {
            if (typeof elementRef === 'function') {
              elementRef(node as unknown as HTMLDivElement);
            } else if (elementRef && 'current' in elementRef) {
              (elementRef as React.MutableRefObject<HTMLDivElement | null>).current = node as unknown as HTMLDivElement;
            }
            if (typeof ref === 'function') {
              ref(node as unknown as HTMLDivElement);
            } else if (ref) {
              ref.current = node as unknown as HTMLDivElement;
            }
          }
        }}
        className={`emoji ${className}`}
        style={baseStyles}
        onClick={isClickable ? onClick : undefined}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        role={isClickable ? "button" : undefined}
        aria-label={isClickable ? `${symbol} emoji` : undefined}
      >
        {symbol}
      </motion.div>
    );
  }

  return content;
});

export default Emoji;
