import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface PuzzleAnimationProps {
  animationState: number; // 0-3 for the four states of completion
}

// Define the puzzle piece interface
interface PuzzlePiece {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean[];  // Visibility in each animation state
  isGreen: boolean[];  // Whether the piece is green in each animation state
}

const PuzzleAnimation: React.FC<PuzzleAnimationProps> = ({
  animationState
}) => {
  // Define puzzle grid (4x4)
  const gridSize = 4;
  const pieceSize = 50;
  const gap = 5;
  const totalSize = gridSize * pieceSize + (gridSize - 1) * gap;
  
  // Create puzzle pieces with randomized visibility for each animation state
  const puzzlePieces = useMemo(() => {
    const pieces: PuzzlePiece[] = [];
    let id = 0;
    
    // Create all possible positions
    const positions = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        positions.push({
          id: id++,
          x: col * (pieceSize + gap),
          y: row * (pieceSize + gap),
          width: pieceSize,
          height: pieceSize
        });
      }
    }
    
    // Shuffle the positions to randomize which pieces appear in each state
    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);
    
    // Total number of pieces
    const totalPieces = gridSize * gridSize;
    
    // Number of pieces visible in each state
    const piecesInState0 = Math.floor(totalPieces * 0.25); // 25%
    const piecesInState1 = Math.floor(totalPieces * 0.5);  // 50%
    const piecesInState2 = Math.floor(totalPieces * 0.75); // 75%
    const piecesInState3 = totalPieces;                    // 100%
    
    // Create pieces with visibility for each state
    shuffledPositions.forEach((pos, index) => {
      const visibleInState0 = index < piecesInState0;
      const visibleInState1 = index < piecesInState1;
      const visibleInState2 = index < piecesInState2;
      const visibleInState3 = true; // All pieces visible in final state
      
      // All pieces are normal color until the final state
      const isGreenInState0 = false;
      const isGreenInState1 = false;
      const isGreenInState2 = false;
      const isGreenInState3 = true; // All pieces turn green in final state
      
      pieces.push({
        ...pos,
        visible: [visibleInState0, visibleInState1, visibleInState2, visibleInState3],
        isGreen: [isGreenInState0, isGreenInState1, isGreenInState2, isGreenInState3]
      });
    });
    
    return pieces;
  }, []);
  
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      backgroundColor: '#222222',
      borderRadius: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        position: 'relative',
        width: totalSize,
        height: totalSize,
        background: '#333333',
        borderRadius: '8px',
        padding: '10px'
      }}>
        {puzzlePieces.map(piece => (
          piece.visible[animationState] && (
            <motion.div
              key={piece.id}
              style={{
                position: 'absolute',
                left: piece.x,
                top: piece.y,
                width: piece.width,
                height: piece.height,
                backgroundColor: piece.isGreen[animationState] ? '#4CAF50' : '#3498db',
                borderRadius: '4px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5,
                delay: piece.id * 0.05 // Stagger the animations
              }}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default PuzzleAnimation;
