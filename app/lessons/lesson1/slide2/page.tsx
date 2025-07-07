'use client';

import { useEffect, useRef, useState } from 'react';
import Emoji from '@/components/ui/Emoji';
import Label from '@/components/ui/Label';
import Tooltip from '@/components/ui/Tooltip';
import { motion } from 'framer-motion';

interface Position {
  x: number;
  y: number;
}

interface Transform {
  position: Position;
  scale: number;
}

interface HouseData {
  id: string;
  label: string;
  emojis: string[];
  position: {
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
  };
}

export default function Slide2() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPositionRef = useRef<Position>({ x: 0, y: 0 });
  const contentContainerRef = useRef<HTMLDivElement>(null);
  
  // References for house emojis
  const houseRefs = {
    cocina: useRef<HTMLDivElement>(null),
    escuela: useRef<HTMLDivElement>(null),
    salud: useRef<HTMLDivElement>(null),
  };
  
  // State for tracking which tooltip is open
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  const [transform, setTransform] = useState<Transform>({
    position: { x: 0, y: 0 },
    scale: 1
  });

  // House data with labels and related emojis
  const houses: HouseData[] = [
    {
      id: 'cocina',
      label: 'Cocina',
      emojis: ['🍳', '🔪', '🍔', '🍲', '🥗', '🍽️'],
      position: { left: '25%', top: '40%' }
    },
    {
      id: 'escuela',
      label: 'Escuela',
      emojis: ['📚', '✏️', '🖊️', '🧮', '🎒', '🏫'],
      position: { left: '50%', top: '40%' }
    },
    {
      id: 'salud',
      label: 'Salud',
      emojis: ['💊', '🩺', '🏥', '🩹', '💉', '🧬'],
      position: { left: '75%', top: '40%' }
    }
  ];

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

  // Function to handle house emoji click
  const handleHouseClick = (houseId: string) => {
    setActiveTooltip(prev => prev === houseId ? null : houseId);
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
          {/* Houses with labels and tooltips */}
          {houses.map((house) => (
            <div key={house.id} style={{ position: 'relative' }}>
              {/* House Emoji with clickable area */}
              <div 
                style={{ 
                  position: 'absolute',
                  left: house.position.left || '50%',
                  top: house.position.top || '50%',
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 1
                }}
                onClick={() => handleHouseClick(house.id)}
              >
                <Emoji
                  symbol="🏘️"
                  size="5rem"
                  isClickable={false}
                  elementRef={houseRefs[house.id as keyof typeof houseRefs]}
                  className="house-emoji"
                />
                
                {/* Label above house */}
                <div style={{ 
                  position: 'absolute',
                  left: '50%',
                  top: '-20px',
                  transform: 'translateX(-50%)',
                  width: 'max-content',
                  zIndex: 5
                }}>
                  <Label 
                    text={house.label}
                    className="house-label"
                  />
                </div>
                
                {/* Tooltip with related emojis - positioned above the label */}
                <Tooltip
                  isOpen={activeTooltip === house.id}
                  onClose={() => setActiveTooltip(null)}
                  emojis={house.emojis}
                  position={{ 
                    left: '50%', 
                    bottom: '100px' // Position above the label
                  }}
                  triggerRef={houseRefs[house.id as keyof typeof houseRefs]}
                  className="house-tooltip"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
