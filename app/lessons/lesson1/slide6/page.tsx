'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import TrialChatInterface from '@/components/ui/TrialChatInterface';

export default function Slide6() {
  // State for drag and zoom functionality
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - lastPosition.current.x;
    const deltaY = e.clientY - lastPosition.current.y;
    
    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Handle mouse wheel for zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.01;
    const newScale = Math.min(Math.max(0.5, scale + delta), 2);
    setScale(newScale);
  };

  // Add and remove event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseLeave = () => {
      isDragging.current = false;
    };

    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="slide-container" style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: '#121212', // Dark background
      position: 'relative'
    }}>
      <div
        ref={containerRef}
        className="draggable-container"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          cursor: isDragging.current ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      >
        <motion.div
          className="canvas"
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            x: position.x,
            y: position.y,
            scale: scale
          }}
        >
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '800px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            <TrialChatInterface animationType="puzzle" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
