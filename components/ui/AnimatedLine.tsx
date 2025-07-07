import React, { useEffect, useState, RefObject, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

interface Point {
  x: number;
  y: number;
}

interface AnimatedLineProps {
  startEl: RefObject<HTMLElement | HTMLDivElement | null>;
  endEl: RefObject<HTMLElement | HTMLDivElement | null>;
  containerEl: RefObject<HTMLElement | HTMLDivElement | null>;
  color?: string;
  thickness?: number;
}

const AnimatedLine: React.FC<AnimatedLineProps> = ({
  startEl,
  endEl,
  containerEl,
  color = '#a7a7a7',
  thickness = 1,
}) => {
  const [start, setStart] = useState<Point | null>(null);
  const [end, setEnd] = useState<Point | null>(null);

  useLayoutEffect(() => {
    if (startEl.current && endEl.current && containerEl.current) {
      const containerRect = containerEl.current.getBoundingClientRect();
      const startRect = startEl.current.getBoundingClientRect();
      const endRect = endEl.current.getBoundingClientRect();

      setStart({
        x: startRect.left - containerRect.left + startRect.width / 2,
        y: startRect.top - containerRect.top + startRect.height / 2,
      });
      setEnd({
        x: endRect.left - containerRect.left + endRect.width / 2,
        y: endRect.top - containerRect.top + endRect.height / 2,
      });
    }
  }, [startEl, endEl, containerEl]);

  if (!start || !end) {
    return null;
  }

  const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
  const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

  if (length === 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: start.y,
        left: start.x,
        transform: `rotate(${angle}deg)`,
        transformOrigin: '0 0',
        zIndex: -1,
      }}
    >
      <svg width={length} height={thickness * 5} style={{ overflow: 'visible', position: 'relative', top: `-${thickness * 2}px` }}>
        <motion.path
          d={`M 0 ${thickness * 2.5} L ${length} ${thickness * 2.5}`}
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray="4 4"
          initial={{ strokeDashoffset: 8 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>
    </div>
  );
};

export default AnimatedLine;
