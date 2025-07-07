import React from 'react';
import { motion } from 'framer-motion';

interface ChatMessageBubbleProps {
  message: string;
  isUser: boolean;
  animate?: boolean;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  isUser,
  animate = true,
}) => {
  const bubbleStyles: React.CSSProperties = {
    maxWidth: '80%',
    padding: '10px 16px',
    borderRadius: '18px',
    marginBottom: '10px',
    backgroundColor: isUser ? '#e1ffc7' : '#f0f0f0',
    color: '#333',
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    position: 'relative',
    wordBreak: 'break-word',
  };

  const bubbleContent = (
    <div
      className={`chat-bubble ${isUser ? 'user-bubble' : 'other-bubble'}`}
      style={bubbleStyles}
    >
      {message}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', width: 'fit-content' }}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {bubbleContent}
      </motion.div>
    );
  }

  return (
    <div style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', width: 'fit-content' }}>
      {bubbleContent}
    </div>
  );
};

export default ChatMessageBubble;
