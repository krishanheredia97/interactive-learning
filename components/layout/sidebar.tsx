'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LessonStructure {
  name: string;
  slides: string[];
}

export default function Sidebar() {
  const [lessons, setLessons] = useState<LessonStructure[]>([]);
  const [expandedLessons, setExpandedLessons] = useState<{[key: string]: boolean}>({});
  const pathname = usePathname();

  // Function to toggle lesson expansion
  const toggleLesson = (lessonName: string) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonName]: !prev[lessonName]
    }));
  };

  // Effect to fetch lesson structure
  useEffect(() => {
    // In a real application, this would be fetched from an API that checks for page.tsx files
    // For now, we'll hardcode only the routes that we know have page.tsx files
    const availableLessons: LessonStructure[] = [
      {
        name: 'lesson1',
        slides: ['slide1', 'slide2', 'slide3', 'slide4', 'slide5', 'slide6'] // All 6 slides
      },
      {
        name: 'lesson2',
        slides: [] // Empty since no slides have page.tsx files yet
      }
    ];

    setLessons(availableLessons);

    // Auto-expand the current lesson based on the URL path
    const currentPath = pathname;
    if (currentPath) {
      const pathParts = currentPath.split('/');
      if (pathParts.length > 2 && pathParts[1] === 'lessons') {
        const currentLesson = pathParts[2];
        setExpandedLessons(prev => ({
          ...prev,
          [currentLesson]: true
        }));
      }
    }
  }, [pathname]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="home-link">
          Home
        </Link>
      </div>
      <div className="sidebar-content">
        <h3 className="sidebar-title">Lessons</h3>
        <ul className="lesson-list">
          {lessons.map((lesson) => (
            // Only show lessons that have at least one slide or are lesson directories with page.tsx
            (lesson.slides.length > 0 || pathname?.includes(`/lessons/${lesson.name}`)) && (
              <li key={lesson.name} className="lesson-item">
                <div 
                  className={`lesson-header ${pathname?.includes(`/lessons/${lesson.name}`) ? 'active' : ''}`}
                  onClick={() => toggleLesson(lesson.name)}
                >
                  <span>{lesson.name}</span>
                  {lesson.slides.length > 0 && (
                    <span className="expand-icon">
                      {expandedLessons[lesson.name] ? '▼' : '►'}
                    </span>
                  )}
                </div>
                {expandedLessons[lesson.name] && lesson.slides.length > 0 && (
                  <ul className="slide-list">
                    {lesson.slides.map((slide) => (
                      <li key={slide} className="slide-item">
                        <Link 
                          href={`/lessons/${lesson.name}/${slide}`}
                          className={pathname === `/lessons/${lesson.name}/${slide}` ? 'active' : ''}
                        >
                          {slide}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          ))}
        </ul>
      </div>
    </div>
  );
}
