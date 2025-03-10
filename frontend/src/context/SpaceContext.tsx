import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateUniqueId } from '../lib/utils';

export interface Testimonial {
  id: string;
  name: string;
  feedback: string;
  mediaUrl?: string;
  date: string;
}

export interface Space {
  id: string;
  name: string;
  description: string;
  shareLink: string;
  testimonials: Testimonial[];
  createdAt: string;
}

interface SpaceContextType {
  spaces: Space[];
  createSpace: (name: string, description: string) => void;
  updateSpace: (id: string, name: string, description: string) => void;
  deleteSpace: (id: string) => void;
  getSpace: (id: string) => Space | undefined;
  addTestimonial: (spaceId: string, testimonial: Omit<Testimonial, 'id' | 'date'>) => void;
  deleteTestimonial: (spaceId: string, testimonialId: string) => void;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spaces, setSpaces] = useState<Space[]>([]);

  useEffect(() => {
    // Load spaces from localStorage
    const storedSpaces = localStorage.getItem('spaces');
    if (storedSpaces) {
      setSpaces(JSON.parse(storedSpaces));
    } else {
      // Add demo spaces if none exist
      const demoSpaces: Space[] = [
        {
          id: '1',
          name: 'Product Feedback',
          description: 'Collect feedback about our product from customers',
          shareLink: `${window.location.origin}/submit/1`,
          testimonials: [
            {
              id: '101',
              name: 'John Doe',
              feedback: 'This product has completely transformed how I work. Highly recommended!',
              date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '102',
              name: 'Jane Smith',
              feedback: 'The customer support is outstanding. They helped me solve my issue in minutes.',
              date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          name: 'Website Testimonials',
          description: 'Testimonials to display on our company website',
          shareLink: `${window.location.origin}/submit/2`,
          testimonials: [],
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setSpaces(demoSpaces);
      localStorage.setItem('spaces', JSON.stringify(demoSpaces));
    }
  }, []);

  // Save spaces to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('spaces', JSON.stringify(spaces));
  }, [spaces]);

  const createSpace = (name: string, description: string) => {
    const newSpace: Space = {
      id: generateUniqueId(),
      name,
      description,
      shareLink: `${window.location.origin}/submit/${generateUniqueId()}`,
      testimonials: [],
      createdAt: new Date().toISOString()
    };
    
    setSpaces(prevSpaces => [...prevSpaces, newSpace]);
  };

  const updateSpace = (id: string, name: string, description: string) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => 
        space.id === id ? { ...space, name, description } : space
      )
    );
  };

  const deleteSpace = (id: string) => {
    setSpaces(prevSpaces => prevSpaces.filter(space => space.id !== id));
  };

  const getSpace = (id: string) => {
    return spaces.find(space => space.id === id);
  };

  const addTestimonial = (spaceId: string, testimonial: Omit<Testimonial, 'id' | 'date'>) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: generateUniqueId(),
      date: new Date().toISOString()
    };
    
    setSpaces(prevSpaces => 
      prevSpaces.map(space => 
        space.id === spaceId 
          ? { ...space, testimonials: [...space.testimonials, newTestimonial] } 
          : space
      )
    );
  };

  const deleteTestimonial = (spaceId: string, testimonialId: string) => {
    setSpaces(prevSpaces => 
      prevSpaces.map(space => 
        space.id === spaceId 
          ? { 
              ...space, 
              testimonials: space.testimonials.filter(t => t.id !== testimonialId) 
            } 
          : space
      )
    );
  };

  return (
    <SpaceContext.Provider value={{ 
      spaces, 
      createSpace, 
      updateSpace, 
      deleteSpace, 
      getSpace,
      addTestimonial,
      deleteTestimonial
    }}>
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpaces = () => {
  const context = useContext(SpaceContext);
  if (context === undefined) {
    throw new Error('useSpaces must be used within a SpaceProvider');
  }
  return context;
};