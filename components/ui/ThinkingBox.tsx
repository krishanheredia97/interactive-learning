import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WordStatus {
  text: string;
  isHighlighted?: boolean;
  isCrossedOut?: boolean;
}

interface ThinkingBoxProps {
  isVisible: boolean;
  words: WordStatus[];
  position?: {
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
  };
  triggerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

const ThinkingBox: React.FC<ThinkingBoxProps> = ({
  isVisible,
  words,
  position = {},
  triggerRef,
  className = '',
}) => {
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const { left, top, right, bottom } = position;
  
  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 10,
    left: left || (right ? undefined : '50%'),
    top: top || (bottom ? undefined : '120%'),
    right,
    bottom,
    transform: (left === undefined && right === undefined) ? 'translateX(-50%)' : undefined,
    backgroundColor: 'rgba(50, 50, 50, 0.9)',
    borderRadius: '12px',
    padding: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    justifyContent: 'center',
    maxWidth: '200px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={tooltipRef}
          className={`thinking-box ${className}`}
          style={baseStyles}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          {words.map((word, index) => (
            <div 
              key={index} 
              className="thinking-word"
              style={{ 
                fontSize: '1rem', 
                color: word.isHighlighted ? '#4CAF50' : '#e0e0e0',
                textDecoration: word.isCrossedOut ? 'line-through' : 'none',
                textDecorationColor: 'red',
                textDecorationThickness: '2px',
                padding: '4px 0',
                textAlign: 'center'
              }}
            >
              {word.text}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThinkingBox;
