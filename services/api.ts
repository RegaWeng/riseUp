
// For real device testing, use your PC's IP address
const API_BASE_URL = 'http://192.168.0.207:3000/api';

// Types
export interface Job {
  _id: string;
  title: string;
  company: string;
  jobType: string;
  location: string;
  workingHours: {
    weekday: string;
    weekend: string;
  };
  learnableSkills: string[];
  minimumSalary: string;
  experienceRequired?: string;
  trainingProvided?: string;
  requiredSkills: string[];
  datePosted: string;
  isActive: boolean;
  approvalStatus: 'preparing' | 'active' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  type: 'user' | 'employer' | 'admin';
  createdAt: string;
}

export interface Application {
  _id: string;
  jobId: string;
  userId: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected';
  appliedDate: string;
  user: User;
  job: Job;
}

export interface CreateJobRequest {
  title: string;
  company: string;
  jobType: string;
  location: string;
  workingHours: {
    weekday: string;
    weekend: string;
  };
  learnableSkills?: string[];
  minimumSalary: string;
  experienceRequired?: string;
  trainingProvided?: string;
  requiredSkills: string[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  type: 'user' | 'employer' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

// API Service Class
class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('API Request URL:', url);
    console.log('API Base URL:', this.baseURL);
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token exists
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      console.log('Making API request to:', url);
      const response = await fetch(url, config);
      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Request URL was:', url);
      throw error;
    }
  }

  // Jobs API
  async getJobs(): Promise<Job[]> {
    return this.request<Job[]>('/jobs');
  }

  async getJob(id: string): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`);
  }

  async createJob(jobData: CreateJobRequest): Promise<Job> {
    return this.request<Job>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(id: string, jobData: Partial<CreateJobRequest>): Promise<Job> {
    return this.request<Job>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async searchJobsByCompany(company: string): Promise<Job[]> {
    return this.request<Job[]>(`/jobs/search/company/${encodeURIComponent(company)}`);
  }

  async searchJobsByLocation(location: string): Promise<Job[]> {
    return this.request<Job[]>(`/jobs/search/location/${encodeURIComponent(location)}`);
  }

  // Users API
  async register(userData: CreateUserRequest): Promise<User> {
    return this.request<User>('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    return this.request<{ user: User; token: string }>('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  // Applications API
  async getApplications(): Promise<Application[]> {
    return this.request<Application[]>('/applications');
  }

  async getApplicationsForEmployer(): Promise<Application[]> {
    return this.request<Application[]>('/applications');
  }

  async getApplicationsForJob(jobId: string): Promise<Application[]> {
    return this.request<Application[]>(`/applications/job/${jobId}`);
  }

  async createApplication(jobId: string): Promise<Application> {
    return this.request<Application>('/applications', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  }

  async updateApplicationStatus(
    applicationId: string,
    status: Application['status']
  ): Promise<Application> {
    return this.request<Application>(`/applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Saved Posts API
  async getSavedPosts(): Promise<any[]> {
    return this.request<any[]>('/savedPosts');
  }

  async savePost(postData: any): Promise<any> {
    return this.request<any>('/savedPosts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async removeSavedPost(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/savedPosts/${id}`, {
      method: 'DELETE',
    });
  }

  // Videos API
  async getVideos(): Promise<any[]> {
    return this.request<any[]>('/videos');
  }

  // Test connection
  async testConnection(): Promise<{ message: string }> {
    return this.request<{ message: string }>('/test');
  }

  // Admin job approval methods
  async approveJob(jobId: string, adminId: string): Promise<Job> {
    return this.request<Job>(`/jobs/approve/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify({ adminId })
    });
  }

  async rejectJob(jobId: string, adminId: string, reason?: string): Promise<Job> {
    return this.request<Job>(`/jobs/reject/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify({ adminId, reason })
    });
  }

  async getPendingJobs(): Promise<Job[]> {
    return this.request<Job[]>('/jobs/pending');
  }

  // Password Reset API
  async requestPasswordReset(email: string): Promise<{ message: string; token: string }> {
    return this.request<{ message: string; token: string }>('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getPasswordResetRequests(): Promise<any[]> {
    return this.request<any[]>('/users/password-reset-requests');
  }

  async approvePasswordReset(requestId: string): Promise<{ message: string; token: string }> {
    return this.request<{ message: string; token: string }>(`/users/approve-password-reset/${requestId}`, {
      method: 'PUT',
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }
}

export const apiService = new ApiService();
