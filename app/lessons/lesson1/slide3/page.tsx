'use client';

import { useEffect, useRef, useState } from 'react';
import AnimatedLine from '@/components/ui/AnimatedLine';
import Emoji from '@/components/ui/Emoji';
import Label from '@/components/ui/Label';
import Tooltip from '@/components/ui/Tooltip';
import { motion, AnimatePresence } from 'framer-motion';

interface Position {
  x: number;
  y: number;
}

interface Transform {
  position: Position;
  scale: number;
}

export default function Slide3() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPositionRef = useRef<Position>({ x: 0, y: 0 });
  const [showBrainBranch, setShowBrainBranch] = useState(false);
  const [showBrainTooltip, setShowBrainTooltip] = useState(false);
  const dogRef = useRef<HTMLDivElement>(null);
  const brainRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  
  const [transform, setTransform] = useState<Transform>({
    position: { x: 0, y: 0 },
    scale: 1
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Function to handle mouse down event for dragging
    const handleMouseDown = (e: MouseEvent) => {
      // Only handle middle mouse button (button 1)
      if (e.button !== 1) return;
      
      e.preventDefault();
      isDraggingRef.current = true;
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };

    // Function to handle mouse move event for dragging
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      const deltaX = e.clientX - lastPositionRef.current.x;
      const deltaY = e.clientY - lastPositionRef.current.y;
      
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
      
      setTransform(prev => ({
        ...prev,
        position: {
          x: prev.position.x + deltaX,
          y: prev.position.y + deltaY
        }
      }));
    };

    // Function to handle mouse up event for dragging
    const handleMouseUp = (e: MouseEvent) => {
      // Only handle middle mouse button release
      if (e.button !== 1 && isDraggingRef.current) return;
      
      isDraggingRef.current = false;
      canvas.style.cursor = 'default';
    };

    // Function to handle wheel event for zooming
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Handle wheel for zooming
      const zoomFactor = 0.1;
      const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
      
      // Calculate zoom point (mouse position)
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      setTransform(prev => {
        const newScale = Math.max(0.1, prev.scale + delta);
        
        // Calculate new position to zoom toward mouse position
        const scaleRatio = newScale / prev.scale;
        
        return {
          scale: newScale,
          position: {
            x: mouseX - (mouseX - prev.position.x) * scaleRatio,
            y: mouseY - (mouseY - prev.position.y) * scaleRatio
          }
        };
      });
    };

    // Function to handle context menu to prevent it on middle click
    const handleContextMenu = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Function to handle dog emoji click
  const handleDogClick = () => {
    setShowBrainBranch(prev => !prev);
    if (showBrainBranch) {
      // If closing the brain branch, ensure tooltip is closed
      setShowBrainTooltip(false);
    }
  };

  // Function to handle brain emoji click
  const handleBrainClick = () => {
    setShowBrainTooltip(prev => !prev);
  };

  return (
    <main className="canvas-container">
      <div 
        ref={canvasRef} 
        className="canvas"
      >
        <div
          ref={contentContainerRef}
          style={{
            transform: `translate(${transform.position.x}px, ${transform.position.y}px) scale(${transform.scale})`,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transformOrigin: '0 0',
          }}
        >
          {/* Dog Emoji (Root) with Label */}
          <div style={{ position: 'relative' }}>
            <Emoji
              symbol="💬"
              size="5.5rem"
              position={{ top: '30%' }}
              isClickable={true}
              onClick={handleDogClick}
              elementRef={dogRef}
            />
            <div style={{ 
              position: 'absolute',
              left: '50%',
              top: '30%',
              transform: 'translate(-50%, -150%)',
              zIndex: 5
            }}>
              <Label 
                text="perro"
                className="dog-label"
              />
            </div>
          </div>

          {/* Brain (Child of Dog) */}
          {showBrainBranch && (
            <>
              <Emoji
                symbol="🧠"
                size="5rem"
                position={{ top: '40%' }}
                isClickable={true}
                onClick={handleBrainClick}
                elementRef={brainRef}
                animate={true}
                className="emoji-secondary"
              />
              <AnimatedLine
                startEl={dogRef}
                endEl={brainRef}
                containerEl={contentContainerRef}
              />

              {/* Custom Tooltip for Brain with related words */}
              <AnimatePresence>
                {showBrainTooltip && (
                  <motion.div
                    className="brain-tooltip"
                    style={{
                      position: 'absolute',
                      zIndex: 10,
                      left: '50%',
                      top: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '12px',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      justifyContent: 'center',
                      maxWidth: '200px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ fontSize: '1rem', padding: '4px 0', color: '#333', fontWeight: 500 }}>gato</div>
                    <div style={{ fontSize: '1rem', padding: '4px 0', color: '#333', fontWeight: 500 }}>mascota</div>
                    <div style={{ fontSize: '1rem', padding: '4px 0', color: '#333', fontWeight: 500 }}>ladrar</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
