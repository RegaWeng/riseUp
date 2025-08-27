import AsyncStorage from '@react-native-async-storage/async-storage';

// Generic functions for any data type
export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
  }
};

export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key}:`, error);
  }
};

// Storage keys based on user type
const getStorageKeys = (userType: 'user' | 'employer') => ({
  SAVED_JOBS: `savedJobs_${userType}`,
  SAVED_VIDEOS: `savedVideos_${userType}`,
  COMPLETED_VIDEOS: `completedVideos_${userType}`,
  APPLIED_JOBS: `appliedJobs_${userType}`,
});

// Type definitions (import from your existing types)
export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  skills: string[];
  savedDate: string;
  type: 'job';
}

export interface SavedVideo {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  skillsGained: string[];
  savedDate: string;
  type: 'video';
}

// Specific storage functions
export const saveSavedJobs = async (userType: 'user' | 'employer', jobs: SavedJob[]): Promise<void> => {
  const keys = getStorageKeys(userType);
  await storeData(keys.SAVED_JOBS, jobs);
};

export const getSavedJobs = async (userType: 'user' | 'employer'): Promise<SavedJob[]> => {
  const keys = getStorageKeys(userType);
  return (await getData<SavedJob[]>(keys.SAVED_JOBS)) || [];
};

export const saveSavedVideos = async (userType: 'user' | 'employer', videos: SavedVideo[]): Promise<void> => {
  const keys = getStorageKeys(userType);
  await storeData(keys.SAVED_VIDEOS, videos);
};

export const getSavedVideos = async (userType: 'user' | 'employer'): Promise<SavedVideo[]> => {
  const keys = getStorageKeys(userType);
  return (await getData<SavedVideo[]>(keys.SAVED_VIDEOS)) || [];
};

export const saveCompletedVideos = async (userType: 'user' | 'employer', videoIds: string[]): Promise<void> => {
  const keys = getStorageKeys(userType);
  await storeData(keys.COMPLETED_VIDEOS, videoIds);
};

export const getCompletedVideos = async (userType: 'user' | 'employer'): Promise<string[]> => {
  const keys = getStorageKeys(userType);
  return (await getData<string[]>(keys.COMPLETED_VIDEOS)) || [];
};

export const saveAppliedJobs = async (userType: 'user' | 'employer', jobIds: string[]): Promise<void> => {
  const keys = getStorageKeys(userType);
  await storeData(keys.APPLIED_JOBS, jobIds);
};

export const getAppliedJobs = async (userType: 'user' | 'employer'): Promise<string[]> => {
  const keys = getStorageKeys(userType);
  return (await getData<string[]>(keys.APPLIED_JOBS)) || [];
};

// Clear data for specific user type
export const clearUserTypeData = async (userType: 'user' | 'employer'): Promise<void> => {
  const keys = getStorageKeys(userType);
  await Promise.all([
    removeData(keys.SAVED_JOBS),
    removeData(keys.SAVED_VIDEOS),
    removeData(keys.COMPLETED_VIDEOS),
    removeData(keys.APPLIED_JOBS),
  ]);
};
