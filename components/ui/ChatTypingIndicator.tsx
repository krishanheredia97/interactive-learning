import React from 'react';
import { motion } from 'framer-motion';

interface ChatTypingIndicatorProps {
  isVisible: boolean;
}

const ChatTypingIndicator: React.FC<ChatTypingIndicatorProps> = ({
  isVisible
}) => {
  if (!isVisible) return null;

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 16px',
    borderRadius: '18px',
    backgroundColor: '#f0f0f0',
    width: 'fit-content',
    marginBottom: '10px',
    alignSelf: 'flex-start',
  };

  const dotVariants = {
    initial: { y: 0 },
    animate: { y: [0, -5, 0] }
  };

  const dotTransition = {
    duration: 1,
    repeat: Infinity,
    repeatType: 'loop' as const,
  };

  const dotStyle: React.CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#666',
    margin: '0 2px',
  };

  return (
    <motion.div
      style={containerStyles}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        style={dotStyle}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0 }}
      />
      <motion.div
        style={dotStyle}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.2 }}
      />
      <motion.div
        style={dotStyle}
        variants={dotVariants}
        initial="initial"
        animate="animate"
        transition={{ ...dotTransition, delay: 0.4 }}
      />
    </motion.div>
  );
};

export default ChatTypingIndicator;
