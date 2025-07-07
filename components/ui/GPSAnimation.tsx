import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Emoji from './Emoji';

interface GPSAnimationProps {
  animationState: number; // 0 for walking (curvy), 1 for biking (straight)
}

const GPSAnimation: React.FC<GPSAnimationProps> = ({
  animationState
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const personRef = useRef<HTMLDivElement>(null);
  const houseRef = useRef<HTMLDivElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });
  
  // Calculate SVG dimensions and path when component mounts or resizes
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const width = container.clientWidth;
      const height = container.clientHeight;
      setSvgDimensions({ width, height });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Constants for emoji positioning and sizing
  const EMOJI_SIZE_PX = 32; // 2rem ≈ 32px
  const PERSON_POSITION = { x: 24, y: 24 };
  const HOUSE_POSITION = { x: svgDimensions.width - 24 - EMOJI_SIZE_PX, y: svgDimensions.height - 24 - EMOJI_SIZE_PX };
  
  // Calculate the center points of the emojis for line connection
  const personCenterX = PERSON_POSITION.x + EMOJI_SIZE_PX / 2;
  const personCenterY = PERSON_POSITION.y + EMOJI_SIZE_PX / 2;
  const houseCenterX = HOUSE_POSITION.x + EMOJI_SIZE_PX / 2;
  const houseCenterY = HOUSE_POSITION.y + EMOJI_SIZE_PX / 2;

  // Generate path data based on animation state
  const getPathData = () => {
    const width = svgDimensions.width;
    const height = svgDimensions.height;
    
    if (width === 0 || height === 0) return '';
    
    if (animationState === 0) {
      // Curvy path for walking (bezier curve)
      // Control points positioned to create a nice curve
      return `M ${personCenterX} ${personCenterY} 
              C ${personCenterX} ${height/2}, 
                ${width/2} ${personCenterY}, 
                ${width/2} ${height/2} 
              S ${width-personCenterX} ${houseCenterY}, 
                ${houseCenterX} ${houseCenterY}`;
    } else {
      // Straight path for biking
      return `M ${personCenterX} ${personCenterY} L ${houseCenterX} ${houseCenterY}`;
    }
  };

  // Calculate emoji position along the path
  const getEmojiPosition = () => {
    const width = svgDimensions.width;
    const height = svgDimensions.height;
    
    if (animationState === 0) {
      // Position for walking emoji (middle of curvy path)
      return {
        x: width / 2 - EMOJI_SIZE_PX / 2,
        y: height / 2 - EMOJI_SIZE_PX / 2
      };
    } else {
      // Position for biking emoji (middle of straight path)
      return {
        x: (personCenterX + houseCenterX) / 2 - EMOJI_SIZE_PX / 2,
        y: (personCenterY + houseCenterY) / 2 - EMOJI_SIZE_PX / 2
      };
    }
  };

  const emojiPosition = getEmojiPosition();
  const pathData = getPathData();

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    >
      {/* SVG for path drawing */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      >
        <motion.path
          d={pathData}
          fill="none"
          stroke="#4285F4"
          strokeWidth={4}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          onUpdate={(latest) => {
            if (typeof latest.pathLength === 'number') {
              setPathLength(latest.pathLength);
            }
          }}
        />
      </svg>

      {/* Person emoji (starting point) */}
      <div style={{ 
        position: 'absolute', 
        top: PERSON_POSITION.y, 
        left: PERSON_POSITION.x, 
        zIndex: 2,
        width: EMOJI_SIZE_PX,
        height: EMOJI_SIZE_PX,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Emoji
          symbol="👤"
          size="2rem"
          elementRef={personRef}
        />
      </div>

      {/* House emoji (ending point) */}
      <div style={{ 
        position: 'absolute', 
        top: HOUSE_POSITION.y, 
        left: HOUSE_POSITION.x, 
        zIndex: 2,
        width: EMOJI_SIZE_PX,
        height: EMOJI_SIZE_PX,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Emoji
          symbol="🏠"
          size="2rem"
          elementRef={houseRef}
        />
      </div>

      {/* Moving emoji based on animation state */}
      <motion.div
        style={{
          position: 'absolute',
          zIndex: 3,
          top: emojiPosition.y,
          left: emojiPosition.x,
          width: EMOJI_SIZE_PX,
          height: EMOJI_SIZE_PX,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Emoji
          symbol={animationState === 0 ? "🚶" : "🚴"}
          size="2rem"
        />
      </motion.div>
    </div>
  );
};

export default GPSAnimation;
