import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Emoji from './Emoji';
import ChatMessageBubble from './ChatMessageBubble';
import ChatTypingIndicator from './ChatTypingIndicator';
import ThinkingBox from './ThinkingBox';

interface AnimationState {
  messages: {
    text: string;
    isUser: boolean;
  }[];
  showTypingIndicator: boolean;
  showThinkingBox: boolean;
  thinkingWords: {
    text: string;
    isHighlighted?: boolean;
    isCrossedOut?: boolean;
  }[];
}

interface DualChatInterfaceProps {
  initialAnimationState?: number;
}

const DualChatInterface: React.FC<DualChatInterfaceProps> = ({
  initialAnimationState = 0,
}) => {
  const [currentAnimation, setCurrentAnimation] = useState(initialAnimationState);
  const brainRef = useRef<HTMLDivElement>(null);

  // Define the animation states
  const animationStates: AnimationState[] = [
    // Animation 1: Initial state with first message
    {
      messages: [
        { text: '¿Qué hiciste hoy?', isUser: true }
      ],
      showTypingIndicator: false,
      showThinkingBox: false,
      thinkingWords: []
    },
    // Animation 2: Second message appears
    {
      messages: [
        { text: '¿Qué hiciste hoy?', isUser: true },
        { text: 'Me enfermé', isUser: false }
      ],
      showTypingIndicator: false,
      showThinkingBox: false,
      thinkingWords: []
    },
    // Animation 3: Brain thinking and typing indicator
    {
      messages: [
        { text: '¿Qué hiciste hoy?', isUser: true },
        { text: 'Me enfermé', isUser: false }
      ],
      showTypingIndicator: true,
      showThinkingBox: true,
      thinkingWords: [
        { text: 'hospital', isHighlighted: false, isCrossedOut: false },
        { text: 'pastilla', isHighlighted: false, isCrossedOut: false },
        { text: 'médico', isHighlighted: false, isCrossedOut: false }
      ]
    },
    // Animation 4: Final message and highlighted/crossed words
    {
      messages: [
        { text: '¿Qué hiciste hoy?', isUser: true },
        { text: 'Me enfermé', isUser: false },
        { text: 'Tuve que ir al médico', isUser: false }
      ],
      showTypingIndicator: false,
      showThinkingBox: true,
      thinkingWords: [
        { text: 'hospital', isHighlighted: false, isCrossedOut: true },
        { text: 'pastilla', isHighlighted: false, isCrossedOut: true },
        { text: 'médico', isHighlighted: true, isCrossedOut: false }
      ]
    }
  ];

  const currentState = animationStates[currentAnimation];

  const handlePrevious = () => {
    setCurrentAnimation(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentAnimation(prev => Math.min(animationStates.length - 1, prev + 1));
  };

  return (
    <div className="dual-chat-interface" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      <div className="panels-container" style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* Left Panel - Chat */}
        <div className="chat-panel" style={{ 
          flex: 1,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f9f9f9',
          borderRight: '1px solid #e0e0e0',
          overflow: 'auto'
        }}>
          <div className="chat-messages" style={{ 
            display: 'flex',
            flexDirection: 'column',
            flex: 1
          }}>
            {currentState.messages.map((msg, index) => (
              <ChatMessageBubble
                key={index}
                message={msg.text}
                isUser={msg.isUser}
                animate={index === currentState.messages.length - 1}
              />
            ))}
            
            {currentState.showTypingIndicator && (
              <ChatTypingIndicator isVisible={true} />
            )}
          </div>
        </div>
        
        {/* Right Panel - Brain */}
        <div className="brain-panel" style={{ 
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ position: 'relative' }}>
            <Emoji
              symbol="🧠"
              size="8rem"
              elementRef={brainRef}
              animate={false}
            />
            
            {currentState.showThinkingBox && (
              <ThinkingBox
                isVisible={true}
                words={currentState.thinkingWords}
                position={{ 
                  top: '-120px',
                  left: '50%'
                }}
                triggerRef={brainRef}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="navigation-container" style={{ 
        display: 'flex',
        justifyContent: 'center',
        padding: '15px',
        backgroundColor: '#f0f0f0',
        borderTop: '1px solid #e0e0e0',
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px'
      }}>
        <button 
          onClick={handlePrevious}
          disabled={currentAnimation === 0}
          style={{
            padding: '8px 16px',
            margin: '0 10px',
            backgroundColor: currentAnimation === 0 ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentAnimation === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Previous
        </button>
        
        <button 
          onClick={handleNext}
          disabled={currentAnimation === animationStates.length - 1}
          style={{
            padding: '8px 16px',
            margin: '0 10px',
            backgroundColor: currentAnimation === animationStates.length - 1 ? '#cccccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: currentAnimation === animationStates.length - 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DualChatInterface;
