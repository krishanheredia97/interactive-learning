import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Emoji from './Emoji';
import ChatMessageBubble from './ChatMessageBubble';
import ChatTypingIndicator from './ChatTypingIndicator';
import GPSAnimation from './GPSAnimation';
import PuzzleAnimation from './PuzzleAnimation';
import Label from './Label';

interface AnimationState {
  messages: {
    text: string;
    isUser: boolean;
  }[];
  showTypingIndicator: boolean;
  animationType: 'gps' | 'puzzle';
  animationState: number; // 0-1 for GPS, 0-3 for puzzle
  robotEmoji?: string; // Emoji to show for the robot
  robotLabel?: string; // Label to show for the robot
}

interface TrialChatInterfaceProps {
  initialAnimationState?: number;
  animationType?: 'gps' | 'puzzle';
}

const TrialChatInterface: React.FC<TrialChatInterfaceProps> = ({
  initialAnimationState = 0,
  animationType = 'gps'
}) => {
  const [currentAnimation, setCurrentAnimation] = useState(initialAnimationState);
  const emojiRef = useRef<HTMLDivElement>(null);

  // Define the animation states
  const gpsAnimationStates: AnimationState[] = [
    // Animation 1: Walking path
    {
      messages: [
        { text: 'Muéstrame el camino más corto a casa', isUser: true },
        { text: 'Tiempo estimado de llegada: 25 minutos', isUser: false }
      ],
      showTypingIndicator: false,
      animationType: 'gps',
      animationState: 0 // Walking (curvy path)
    },
    // Animation 2: Biking path
    {
      messages: [
        { text: 'Muéstrame el camino más corto a casa, voy en bicicleta', isUser: true },
        { text: 'Tiempo estimado de llegada: 10 minutos', isUser: false }
      ],
      showTypingIndicator: false,
      animationType: 'gps',
      animationState: 1 // Biking (straight path)
    }
  ];
  
  // Define the puzzle animation states
  const puzzleAnimationStates: AnimationState[] = [
    // Animation 1: 25% of puzzle
    {
      messages: [
        { text: 'Necesito entender el ciclo de Krebs para mi examen de bioquímica', isUser: true }
      ],
      showTypingIndicator: false,
      animationType: 'puzzle',
      animationState: 0,
      robotEmoji: '🤖', // Robot emoji stays constant
      robotLabel: '😵‍💫' // Emoji in the label changes
    },
    // Animation 2: 50% of puzzle
    {
      messages: [
        { text: 'Estoy estudiando bioquímica y no logro memorizar las etapas del ciclo de Krebs ni entender por qué es importante para el metabolismo celular', isUser: true }
      ],
      showTypingIndicator: false,
      animationType: 'puzzle',
      animationState: 1,
      robotEmoji: '🤖', // Robot emoji stays constant
      robotLabel: '😕' // Emoji in the label changes
    },
    // Animation 3: 75% of puzzle
    {
      messages: [
        { text: 'Soy estudiante de medicina de tercer semestre, tengo examen de bioquímica en 3 días sobre metabolismo. Entiendo que el ciclo de Krebs produce ATP pero no logro conectar cada paso con las enzimas y coenzimas involucradas', isUser: true }
      ],
      showTypingIndicator: false,
      animationType: 'puzzle',
      animationState: 2,
      robotEmoji: '🤖', // Robot emoji stays constant
      robotLabel: '🤔' // Emoji in the label changes
    },
    // Animation 4: 100% of puzzle (all green)
    {
      messages: [
        { text: 'Soy estudiante de medicina de tercer semestre, mi profesor siempre pregunta casos clínicos en los exámenes. Necesito entender el ciclo de Krebs no solo para memorizarlo, sino para explicar qué pasa cuando hay deficiencias enzimáticas. Ayúdame con un mapa conceptual que conecte cada paso con posibles patologías y cómo afectan al paciente', isUser: true }
      ],
      showTypingIndicator: false,
      animationType: 'puzzle',
      animationState: 3,
      robotEmoji: '🤖', // Robot emoji stays constant
      robotLabel: '💡' // Emoji in the label changes
    }
  ];
  
  // Select the appropriate animation states based on the animationType prop
  const animationStates = animationType === 'gps' ? gpsAnimationStates : puzzleAnimationStates;

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
          backgroundColor: '#1e1e1e', // Dark background
          borderRight: '1px solid #333333',
          overflow: 'auto'
        }}>
          <div className="chat-messages" style={{ 
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            color: '#e0e0e0' // Light text for dark background
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
        
        {/* Middle Panel - Animation (GPS or Puzzle) */}
        <div className="animation-panel" style={{ 
          flex: 1.5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: '#2a2a2a', // Dark background
          padding: '20px'
        }}>
          {currentState.animationType === 'gps' ? (
            <GPSAnimation animationState={currentState.animationState} />
          ) : (
            <PuzzleAnimation animationState={currentState.animationState} />
          )}
        </div>
        
        {/* Right Panel - Emoji (Satellite for GPS or Robot with label for Puzzle) */}
        <div className="emoji-panel" style={{ 
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          backgroundColor: '#2a2a2a' // Dark background
        }}>
          <div style={{ position: 'relative' }}>
            <Emoji
              symbol={currentState.animationType === 'gps' ? '🛰️' : '🤖'}
              size="8rem"
              elementRef={emojiRef}
              animate={false}
            />
            {currentState.animationType === 'puzzle' && currentState.robotLabel && (
              <div style={{ 
                position: 'absolute', 
                top: '-60px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                zIndex: 5
              }}>
                <span style={{ 
                  fontSize: '3rem',
                  filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.5))'
                }}>
                  {currentState.robotLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom Navigation */}
      <div className="navigation-container" style={{ 
        display: 'flex',
        justifyContent: 'center',
        padding: '15px',
        backgroundColor: '#1a1a1a',
        borderTop: '1px solid #333333',
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
