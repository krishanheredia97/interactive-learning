'use client';

import { useEffect, useRef, useState } from 'react';
import AnimatedLine from '@/components/ui/AnimatedLine';
import Emoji from '@/components/ui/Emoji';
import { motion } from 'framer-motion';

interface Position {
  x: number;
  y: number;
}

interface Transform {
  position: Position;
  scale: number;
}

export default function Slide1() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPositionRef = useRef<Position>({ x: 0, y: 0 });
  const [showHospitalBranch, setShowHospitalBranch] = useState(false);
  const [showBrainBranches, setShowBrainBranches] = useState(false);
  const hospitalRef = useRef<HTMLDivElement>(null);
  const brainRef = useRef<HTMLDivElement>(null);
  const syringeRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const stethoscopeRef = useRef<HTMLDivElement>(null);
  const ambulanceRef = useRef<HTMLDivElement>(null);
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

  // Function to handle hospital emoji click
  const handleHospitalClick = () => {
    setShowHospitalBranch(prev => !prev);
    if (!showHospitalBranch) {
      // If opening the hospital branch, ensure brain branches are closed
      setShowBrainBranches(false);
    }
  };

  // Function to handle brain emoji click
  const handleBrainClick = () => {
    setShowBrainBranches(prev => !prev);
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
          {/* Hospital (Root) */}
          <Emoji
            symbol="🏥"
            size="5.5rem"
            position={{ top: '30%' }}
            isClickable={true}
            onClick={handleHospitalClick}
            elementRef={hospitalRef}
          />

          {/* Brain (Child of Hospital) */}
          {showHospitalBranch && (
            <>
              <Emoji
                symbol="🧠"
                size="5.5rem"
                position={{ top: '50%' }}
                isClickable={true}
                onClick={handleBrainClick}
                elementRef={brainRef}
                animate={true}
                className="emoji-secondary"
              />
              <AnimatedLine
                startEl={hospitalRef}
                endEl={brainRef}
                containerEl={contentContainerRef}
              />

              {/* Children of Brain */}
              {showBrainBranches && (
                <>
                  {/* Syringe - Bottom Right */}
                  <Emoji
                    symbol="💉"
                    size="4.5rem"
                    position={{ left: 'calc(50% + 120px)', top: 'calc(50% + 120px)' }}
                    elementRef={syringeRef}
                    animate={true}
                    className="emoji-secondary"
                  />
                  <AnimatedLine
                    startEl={brainRef}
                    endEl={syringeRef}
                    containerEl={contentContainerRef}
                  />
                  
                  {/* Pill - Bottom Left */}
                  <Emoji
                    symbol="💊"
                    size="4.5rem"
                    position={{ left: 'calc(50% - 120px)', top: 'calc(50% + 120px)' }}
                    elementRef={pillRef}
                    animate={true}
                    className="emoji-secondary"
                  />
                  <AnimatedLine
                    startEl={brainRef}
                    endEl={pillRef}
                    containerEl={contentContainerRef}
                  />
                  
                  {/* Stethoscope - Bottom */}
                  <Emoji
                    symbol="🩺"
                    size="4.5rem"
                    position={{ top: 'calc(50% + 170px)' }}
                    elementRef={stethoscopeRef}
                    animate={true}
                    className="emoji-secondary"
                  />
                  <AnimatedLine
                    startEl={brainRef}
                    endEl={stethoscopeRef}
                    containerEl={contentContainerRef}
                  />
                  
                  {/* Ambulance - Bottom */}
                  <Emoji
                    symbol="🚑"
                    size="4.5rem"
                    position={{ top: 'calc(50% + 240px)' }}
                    elementRef={ambulanceRef}
                    animate={true}
                    className="emoji-secondary"
                  />
                  <AnimatedLine
                    startEl={brainRef}
                    endEl={ambulanceRef}
                    containerEl={contentContainerRef}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
