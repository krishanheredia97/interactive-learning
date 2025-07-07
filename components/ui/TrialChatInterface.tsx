import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Emoji from './Emoji';
import ChatMessageBubble from './ChatMessageBubble';
import ChatTypingIndicator from './ChatTypingIndicator';
import GPSAnimation from './GPSAnimation';

interface AnimationState {
  messages: {
    text: string;
    isUser: boolean;
  }[];
  showTypingIndicator: boolean;
  gpsAnimationState: number; // 0 for walking (curvy), 1 for biking (straight)
}

interface TrialChatInterfaceProps {
  initialAnimationState?: number;
}

const TrialChatInterface: React.FC<TrialChatInterfaceProps> = ({
  initialAnimationState = 0,
}) => {
  const [currentAnimation, setCurrentAnimation] = useState(initialAnimationState);
  const emojiRef = useRef<HTMLDivElement>(null);

  // Define the animation states
  const animationStates: AnimationState[] = [
    // Animation 1: Walking path
    {
      messages: [
        { text: 'Muéstrame el camino más corto a casa', isUser: true },
        { text: 'Tiempo estimado de llegada: 25 minutos', isUser: false }
      ],
      showTypingIndicator: false,
      gpsAnimationState: 0 // Walking (curvy path)
    },
    // Animation 2: Biking path
    {
      messages: [
        { text: 'Muéstrame el camino más corto a casa, voy en bicicleta', isUser: true },
        { text: 'Tiempo estimado de llegada: 10 minutos', isUser: false }
      ],
      showTypingIndicator: false,
      gpsAnimationState: 1 // Biking (straight path)
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
    <div className="trial-chat-interface" style={{ 
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
        
        {/* Middle Panel - GPS Animation */}
        <div className="gps-panel" style={{ 
          flex: 1.5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: '#ffffff',
          padding: '20px'
        }}>
          <GPSAnimation animationState={currentState.gpsAnimationState} />
        </div>
        
        {/* Right Panel - Satellite Emoji (GPS) */}
        <div className="emoji-panel" style={{ 
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: '#ffffff'
        }}>
          <div style={{ position: 'relative' }}>
            <Emoji
              symbol="🛰️"
              size="8rem"
              elementRef={emojiRef}
              animate={false}
            />
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

export default TrialChatInterface;
