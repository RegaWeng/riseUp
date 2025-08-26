import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
    getAppliedJobs,
    getCompletedVideos,
    getSavedJobs,
    getSavedVideos,
    saveAppliedJobs,
    saveCompletedVideos,
    saveSavedJobs,
    saveSavedVideos
} from '../utils/localStorage';
import { useAdmin } from './AdminContext';

// Define the structure of saved items
interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  savedDate: string;
  type: 'job';
}

interface SavedVideo {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  skillsGained: string[];
  savedDate: string;
  type: 'video';
}

// Training data structure (imported from training tab)
interface TrainingVideo {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  skillsGained: string[];
}

// Context interface - now includes training completion and job applications
interface SavedContextType {
  savedJobs: SavedJob[];
  savedVideos: SavedVideo[];
  completedVideos: string[];
  appliedJobs: string[];
  saveJob: (job: SavedJob) => void;
  unsaveJob: (jobId: string) => void;
  saveVideo: (video: SavedVideo) => void;
  unsaveVideo: (videoId: string) => void;
  isJobSaved: (jobId: string) => boolean;
  isVideoSaved: (videoId: string) => boolean;
  completeVideo: (videoId: string) => void;
  isVideoCompleted: (videoId: string) => boolean;
  applyToJob: (jobId: string) => void;
  withdrawJobApplication: (jobId: string) => void;
  isJobApplied: (jobId: string) => boolean;
  getCompletedVideosWithDetails: () => TrainingVideo[];
}

// Create the context
const SavedContext = createContext<SavedContextType | undefined>(undefined);

// Training data (shared across app)
export const TRAINING_DATA: TrainingVideo[] = [
  {
    id: '1',
    title: 'Customer Service Basics',
    category: 'Customer Service',
    duration: '8 min',
    description: 'Learn how to handle customers professionally',
    skillsGained: ['communication', 'problem solving', 'patience'],
  },
  {
    id: '2',
    title: 'Cash Handling Safety',
    category: 'Customer Service',
    duration: '5 min',
    description: 'Proper cash register and money handling techniques',
    skillsGained: ['cash handling', 'accuracy', 'security'],
  },
  {
    id: '3',
    title: 'Safe Driving Tips',
    category: 'Driving',
    duration: '12 min',
    description: 'Essential safety tips for delivery drivers',
    skillsGained: ['driving safety', 'navigation', 'time management'],
  },
  {
    id: '4',
    title: 'Route Planning',
    category: 'Driving',
    duration: '6 min',
    description: 'How to plan efficient delivery routes',
    skillsGained: ['navigation', 'efficiency', 'planning'],
  },
  {
    id: '5',
    title: 'Cleaning Techniques',
    category: 'Cleaning',
    duration: '10 min',
    description: 'Professional cleaning methods and best practices',
    skillsGained: ['attention to detail', 'efficiency', 'hygiene'],
  },
  {
    id: '6',
    title: 'Safety Equipment',
    category: 'Cleaning',
    duration: '7 min',
    description: 'How to use cleaning equipment safely',
    skillsGained: ['safety', 'equipment handling', 'protocols'],
  },
  {
    id: '7',
    title: 'Food Safety Basics',
    category: 'Food Service',
    duration: '9 min',
    description: 'Essential food safety and hygiene practices',
    skillsGained: ['food safety', 'hygiene', 'regulations'],
  },
  {
    id: '8',
    title: 'Warehouse Organization',
    category: 'Warehouse',
    duration: '11 min',
    description: 'How to organize and manage warehouse inventory',
    skillsGained: ['organization', 'inventory', 'efficiency'],
  },
];

// Provider component
export const SavedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { getCurrentUserType } = useAdmin();
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [savedVideos, setSavedVideos] = useState<SavedVideo[]>([]);
  const [completedVideos, setCompletedVideos] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data from localStorage based on current user type
  useEffect(() => {
    const loadStoredData = async () => {
      const userType = getCurrentUserType();
      
      const [storedSavedJobs, storedSavedVideos, storedCompletedVideos, storedAppliedJobs] = await Promise.all([
        getSavedJobs(userType),
        getSavedVideos(userType),
        getCompletedVideos(userType),
        getAppliedJobs(userType)
      ]);
      
      setSavedJobs(storedSavedJobs);
      setSavedVideos(storedSavedVideos);
      setCompletedVideos(storedCompletedVideos);
      setAppliedJobs(storedAppliedJobs);
      setIsInitialized(true);
    };
    
    loadStoredData();
  }, [getCurrentUserType]);

  // Save to localStorage whenever data changes - but only after initial load is complete
  useEffect(() => {
    if (isInitialized) {
      const userType = getCurrentUserType();
      saveSavedJobs(userType, savedJobs);
    }
  }, [savedJobs, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      const userType = getCurrentUserType();
      saveSavedVideos(userType, savedVideos);
    }
  }, [savedVideos, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      const userType = getCurrentUserType();
      saveCompletedVideos(userType, completedVideos);
    }
  }, [completedVideos, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      const userType = getCurrentUserType();
      saveAppliedJobs(userType, appliedJobs);
    }
  }, [appliedJobs, isInitialized]);

  // Save a job
  const saveJob = (job: SavedJob) => {
    setSavedJobs(prev => {
      // Check if already saved
      if (prev.find(savedJob => savedJob.id === job.id)) {
        return prev; // Already saved, don't add duplicate
      }
      console.log(`Job saved to context: ${job.title}`);
      return [...prev, job];
    });
  };

  // Unsave a job
  const unsaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const filtered = prev.filter(job => job.id !== jobId);
      console.log(`Job unsaved from context: ${jobId}`);
      return filtered;
    });
  };

  // Save a video
  const saveVideo = (video: SavedVideo) => {
    setSavedVideos(prev => {
      // Check if already saved
      if (prev.find(savedVideo => savedVideo.id === video.id)) {
        return prev; // Already saved, don't add duplicate
      }
      console.log(`Video saved to context: ${video.title}`);
      return [...prev, video];
    });
  };

  // Unsave a video
  const unsaveVideo = (videoId: string) => {
    setSavedVideos(prev => {
      const filtered = prev.filter(video => video.id !== videoId);
      console.log(`Video unsaved from context: ${videoId}`);
      return filtered;
    });
  };

  // Complete a video
  const completeVideo = (videoId: string) => {
    setCompletedVideos(prev => {
      if (prev.includes(videoId)) {
        return prev; // Already completed
      }
      const video = TRAINING_DATA.find(v => v.id === videoId);
      console.log(`Video completed: ${video?.title || videoId}`);
      return [...prev, videoId];
    });
  };

  // Apply to a job
  const applyToJob = (jobId: string) => {
    setAppliedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev; // Already applied
      }
      console.log(`Applied to job: ${jobId}`);
      return [...prev, jobId];
    });
  };

  // Withdraw job application
  const withdrawJobApplication = (jobId: string) => {
    setAppliedJobs(prev => {
      const filtered = prev.filter(id => id !== jobId);
      console.log(`Withdrew application for job: ${jobId}`);
      return filtered;
    });
  };

  // Check if job is saved
  const isJobSaved = (jobId: string): boolean => {
    return savedJobs.some(job => job.id === jobId);
  };

  // Check if video is saved
  const isVideoSaved = (videoId: string): boolean => {
    return savedVideos.some(video => video.id === videoId);
  };

  // Check if video is completed
  const isVideoCompleted = (videoId: string): boolean => {
    return completedVideos.includes(videoId);
  };

  // Check if job is applied
  const isJobApplied = (jobId: string): boolean => {
    return appliedJobs.includes(jobId);
  };

  // Get completed videos with full details
  const getCompletedVideosWithDetails = (): TrainingVideo[] => {
    return TRAINING_DATA.filter(video => completedVideos.includes(video.id));
  };

  const value: SavedContextType = {
    savedJobs,
    savedVideos,
    completedVideos,
    appliedJobs,
    saveJob,
    unsaveJob,
    saveVideo,
    unsaveVideo,
    isJobSaved,
    isVideoSaved,
    completeVideo,
    isVideoCompleted,
    applyToJob,
    withdrawJobApplication,
    isJobApplied,
    getCompletedVideosWithDetails,
  };

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
};

// Custom hook to use the context
export const useSaved = () => {
  const context = useContext(SavedContext);
  if (context === undefined) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return context;
};

// Default export for Expo Router
export default SavedProvider; 