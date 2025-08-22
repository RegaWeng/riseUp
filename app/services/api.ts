const API_BASE_URL = 'http://localhost:3000/api';

// Job API functions
export const jobAPI = {
  // Get all jobs
  getAllJobs: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Get single job
  getJob: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },

  // Create new job
  createJob: async (jobData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  // Update job
  updateJob: async (id: string, jobData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  // Delete job
  deleteJob: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  // Search jobs by company
  searchJobsByCompany: async (company: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/search/company/${company}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching jobs by company:', error);
      throw error;
    }
  },

  // Search jobs by location
  searchJobsByLocation: async (location: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/search/location/${location}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching jobs by location:', error);
      throw error;
    }
  },
};

// Video API functions
export const videoAPI = {
  // Get all videos
  getAllVideos: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error;
    }
  },

  // Get single video
  getVideo: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error;
    }
  },

  // Create new video
  createVideo: async (videoData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating video:', error);
      throw error;
    }
  },

  // Update video
  updateVideo: async (id: string, videoData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error;
    }
  },

  // Delete video
  deleteVideo: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error;
    }
  },

  // Search videos by category
  searchVideosByCategory: async (category: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/search/category/${category}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching videos by category:', error);
      throw error;
    }
  },

  // Search videos by skills
  searchVideosBySkills: async (skill: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/videos/search/skills/${skill}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching videos by skills:', error);
      throw error;
    }
  },
};
