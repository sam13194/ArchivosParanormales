'use client';

import { useState, useEffect } from 'react';

// No more mock data - will use real API calls

interface Story {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url: string;
  audio_url: string;
  created_at: string;
  status: string;
}

interface HomepageConfig {
  hero_story: Story | null;
  carousel_stories: Story[];
  featured_categories: Array<{ name: string; count: number }>;
}

export function useHomepageConfig() {
  // State
  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>({
    hero_story: null,
    carousel_stories: [],
    featured_categories: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [allStories, setAllStories] = useState<Story[]>([]);

  // Computed values
  const categories = ['Todas', ...Array.from(new Set((allStories || []).map(story => story.category || 'Sin categoría').filter(Boolean)))];
  
  const filteredStories = (allStories || []).filter(story => {
    const matchesSearch = (story.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (story.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || story.category === selectedCategory;
    return matchesSearch && matchesCategory && story.status === 'published';
  });

  // Load homepage config on mount
  useEffect(() => {
    loadHomepageConfig();
  }, []);

  // Load homepage configuration
  const loadHomepageConfig = async () => {
    try {
      // Load stories from API
      const response = await fetch('/api/stories');
      const result = await response.json();
      
      // Ensure we have an array of stories
      const stories = Array.isArray(result) ? result : (result.stories || []);
      setAllStories(stories);
      
      // Create default homepage config with real data
      const defaultConfig: HomepageConfig = {
        hero_story: stories.length > 0 ? stories[0] : null,
        carousel_stories: stories.slice(0, 6),
        featured_categories: []
      };
      
      setHomepageConfig(defaultConfig);
      
    } catch (error) {
      console.error('Error loading homepage config:', error);
      // Use empty default config as fallback
      setAllStories([]);
      const fallbackConfig: HomepageConfig = {
        hero_story: null,
        carousel_stories: [],
        featured_categories: []
      };
      setHomepageConfig(fallbackConfig);
    }
  };

  // Set hero story
  const setHeroStory = (story: Story) => {
    setHomepageConfig(prev => ({
      ...prev,
      hero_story: story
    }));
  };

  // Add story to carousel
  const addStoryToCarousel = (story: Story) => {
    setHomepageConfig(prev => {
      // Check if story is already in carousel
      if (prev.carousel_stories.find(s => s.id === story.id)) {
        alert('Esta historia ya está en el carrusel');
        return prev;
      }
      
      // Limit carousel to 5 stories
      if (prev.carousel_stories.length >= 5) {
        alert('El carrusel está lleno (máximo 5 historias)');
        return prev;
      }
      
      return {
        ...prev,
        carousel_stories: [...prev.carousel_stories, story]
      };
    });
  };

  // Remove story from carousel
  const removeStoryFromCarousel = (storyId: number) => {
    setHomepageConfig(prev => ({
      ...prev,
      carousel_stories: prev.carousel_stories.filter(story => story.id !== storyId)
    }));
  };

  // Move carousel item
  const moveCarousel = (fromIndex: number, toIndex: number) => {
    setHomepageConfig(prev => {
      const newCarousel = [...prev.carousel_stories];
      const [movedItem] = newCarousel.splice(fromIndex, 1);
      newCarousel.splice(toIndex, 0, movedItem);
      
      return {
        ...prev,
        carousel_stories: newCarousel
      };
    });
  };

  // Save homepage configuration
  const saveHomepageConfig = async () => {
    try {
      // In production, this would be an API call
      // const response = await fetch('/api/homepage-config', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(homepageConfig)
      // });
      
      // For now, just simulate the save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Configuración guardada exitosamente');
      console.log('Saved homepage config:', homepageConfig);
      
    } catch (error) {
      console.error('Error saving homepage config:', error);
      alert('Error al guardar la configuración');
    }
  };

  // Get activity icon for dashboard
  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'story_published': return '📖';
      case 'user_registered': return '👤';
      case 'comment_added': return '💬';
      case 'story_liked': return '❤️';
      default: return '📝';
    }
  };

  // Get status badge for stories
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
      case 'activo':
      case 'completado':
      case 'positivo':
        return { text: 'Activo', className: 'bg-green-100 text-green-800' };
      case 'draft':
      case 'pendiente':
        return { text: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' };
      case 'archived':
      case 'inactivo':
        return { text: 'Inactivo', className: 'bg-gray-100 text-gray-800' };
      default:
        return { text: status, className: 'bg-gray-100 text-gray-800' };
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return {
    // State
    homepageConfig,
    setHomepageConfig,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    
    // Computed values
    categories,
    filteredStories,
    
    // Functions
    loadHomepageConfig,
    setHeroStory,
    addStoryToCarousel,
    removeStoryFromCarousel,
    moveCarousel,
    saveHomepageConfig,
    
    // Utility functions
    getActivityIcon,
    getStatusBadge,
    formatCurrency
  };
}