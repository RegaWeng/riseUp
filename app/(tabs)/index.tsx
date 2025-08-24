import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { apiService, Job } from '../services/api';



// Sample job data - this would come from an API later
const SAMPLE_JOBS = [
  {
    id: '1',
    title: 'Cashier',
    company: 'Metro Grocery',
    location: 'Downtown',
    salary: '$15/hour',
    skills: ['customer service', 'cash handling', 'communication'],
  },
  {
    id: '2',
    title: 'Delivery Driver',
    company: 'QuickEats',
    location: 'City Wide',
    salary: '$18/hour + tips',
    skills: ['driving license', 'navigation', 'time management'],
  },
  {
    id: '3',
    title: 'Cleaner',
    company: 'CleanCorp',
    location: 'Various Offices',
    salary: '$16/hour',
    skills: ['attention to detail', 'physical stamina', 'reliability'],
  },
  {
    id: '4',
    title: 'Warehouse Worker',
    company: 'LogiCorp',
    location: 'Industrial Park',
    salary: '$17/hour',
    skills: ['lifting', 'organization', 'teamwork'],
  },
  {
    id: '5',
    title: 'Food Service',
    company: 'Burger Palace',
    location: 'Mall',
    salary: '$14/hour',
    skills: ['food safety', 'multitasking', 'customer service'],
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  
  // Render different content based on user type
  if (user?.type === 'employer') {
    return <EmployerHomeContent />;
  }
  
  if (user?.type === 'admin') {
    return <AdminHomeContent />;
  }
  
  // Default user content
  return <UserHomeContent />;
}

// User home content (job browsing)
function UserHomeContent() {
  const [searchText, setSearchText] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [removedJobs, setRemovedJobs] = useState<string[]>([]);
  
  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await apiService.getJobs();
        setJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        Alert.alert('Error', 'Failed to load jobs. Please try again.');
        // Fallback to sample data
        setJobs([]);
        setFilteredJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search text
  useEffect(() => {
    if (searchText.trim() === '') {
      setFilteredJobs(jobs.filter(job => !removedJobs.includes(job._id)));
    } else {
      const filtered = jobs.filter(job => 
        !removedJobs.includes(job._id) &&
        (job.title.toLowerCase().includes(searchText.toLowerCase()) ||
         job.company.toLowerCase().includes(searchText.toLowerCase()) ||
         job.location.toLowerCase().includes(searchText.toLowerCase()) ||
         job.jobType.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredJobs(filtered);
    }
  }, [searchText, jobs, removedJobs]);
  
  // Use shared context for saved jobs and job applications
  const { 
    savedJobs, 
    saveJob, 
    unsaveJob, 
    isJobSaved, 
    appliedJobs, 
    applyToJob, 
    withdrawJobApplication, 
    isJobApplied 
  } = useSaved();

  // Use tab context to update header color



  
  // Filter jobs based on search text and exclude removed jobs
  const filteredJobs = SAMPLE_JOBS.filter(job => 
    !removedJobs.includes(job.id) && // Don't show removed jobs
    (job.title.toLowerCase().includes(searchText.toLowerCase()) ||
    job.company.toLowerCase().includes(searchText.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchText.toLowerCase())))
  );

  // Handle job application using shared context and API
  const handleApply = async (jobId: string, jobTitle: string) => {
    if (isJobApplied(jobId)) {
      console.log(`Already applied to ${jobTitle}`);
      return;
    }

    try {
      await apiService.createApplication(jobId);
      applyToJob(jobId);
      Alert.alert('Success', `Applied to ${jobTitle} successfully!`);
      console.log(`Application submitted for ${jobTitle}`);
    } catch (error) {
      console.error('Error applying to job:', error);
      Alert.alert('Error', 'Failed to apply to job. Please try again.');
    }
  };

  // Handle withdrawing application using shared context
  const handleWithdraw = (jobId: string, jobTitle: string) => {
    console.log("Withdraw button tapped for:", jobTitle);
    withdrawJobApplication(jobId);
    console.log(`Application withdrawn for ${jobTitle}`);
  };

  // Handle removing job from list
  const handleRemoveJob = (jobId: string, jobTitle: string) => {
    console.log("Remove button tapped for:", jobTitle);
    // Direct removal without confirmation for now
    setRemovedJobs(prev => [...prev, jobId]);
    // Also remove from applied jobs if it was applied
    if (isJobApplied(jobId)) {
      withdrawJobApplication(jobId);
    }
    // Also remove from saved jobs if it was saved
    if (isJobSaved(jobId)) {
      unsaveJob(jobId);
    }
    console.log(`Job removed: ${jobTitle}`);
  };

  // Handle saving job using shared context
  const handleSaveJob = (jobId: string, jobTitle: string) => {
    const job = filteredJobs.find(j => j._id === jobId);
    if (!job) return;

    if (isJobSaved(jobId)) {
      // Already saved - unsave it
      unsaveJob(jobId);
      console.log(`Job unsaved: ${jobTitle}`);
    } else {
      // Not saved - save it
      const savedJob = {
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.minimumSalary,
        skills: job.requiredSkills,
        savedDate: new Date().toISOString(),
        type: 'job' as const,
      };
      saveJob(savedJob);
      console.log(`Job saved: ${jobTitle}`);
    }
  };

  // Calculate counts for status display
  const applicationCount = appliedJobs.length;
  const savedCount = savedJobs.length;
  const removedCount = removedJobs.length;

  const renderJobItem = ({ item }: { item: Job }) => {
    const hasApplied = isJobApplied(item._id);
    const isSaved = isJobSaved(item._id);

    return (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <View style={styles.jobActions}>
            <TouchableOpacity 
              style={styles.starButton}
              onPress={() => handleSaveJob(item._id, item.title)}
            >
              <Text style={styles.starButtonText}>
                {isSaved ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemove(item._id, item.title)}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.company}>{item.company}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.salary}>{item.salary}</Text>
        
        <View style={styles.skillsContainer}>
          {item.skills.map((skill: string, index: number) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.buttonContainer}>
          {hasApplied ? (
            <TouchableOpacity 
              style={styles.withdrawButton}
              onPress={() => handleWithdraw(item.id, item.title)}
            >
              <Text style={styles.withdrawButtonText}>Withdraw</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => handleApply(item.id, item.title)}
            >
              <Text style={styles.applyButtonText}>Apply Now</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.saveButton, isSaved && styles.savedButton]}
            onPress={() => handleSaveJob(item.id, item.title)}
          >
            <Text style={[styles.saveButtonText, isSaved && styles.savedButtonText]}>
              {isSaved ? '✓ Saved' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Status Section */}
      <View style={[styles.statusSection, { backgroundColor: '#007AFF' }]}>
        <Text style={[styles.subtitle, { color: 'white' }]}>Find your next opportunity</Text>
        <Text style={[styles.stats, { color: 'rgba(255,255,255,0.8)' }]}>
          Applied: {applicationCount} • Saved: {savedCount} • Removed: {removedCount}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs, companies, or skills..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Job List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item._id}
          style={styles.jobList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No jobs available at the moment</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusSection: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  stats: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  jobList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  jobCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  removeButton: {
    padding: 5,
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starButton: {
    padding: 5,
  },
  starButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  salary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  withdrawButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    flex: 1,
  },
  withdrawButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    flex: 1,
  },
  savedButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  savedButtonText: {
    color: 'white',
  },
  // Employer-specific styles
  postJobButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  postJobButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  jobStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statText: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalPostButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    padding: 16,
  },
  modalInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    fontSize: 16,
  },
  modalTextArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  jobType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  skillsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  learnableSkillTag: {
    backgroundColor: '#e8f5e8',
    borderColor: '#34C759',
  },
  learnableSkillText: {
    color: '#34C759',
  },
  // Admin-specific styles
  adminToggle: {
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
    padding: 4,
    marginTop: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeToggleText: {
    color: 'white',
  },
});

// Employer home content (job posting)
function EmployerHomeContent() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostJobModalVisible, setIsPostJobModalVisible] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: user?.name || 'Your Company',
    jobType: 'Other',
    location: '',
    workingHours: {
      weekday: '9 AM - 5 PM',
      weekend: 'Off'
    },
    minimumSalary: '',
    requiredSkills: ['Basic English'],
    learnableSkills: [],
    experienceRequired: '',
    trainingProvided: '',
  });

  // Fetch employer's jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const allJobs = await apiService.getJobs();
        // Filter jobs by company (in a real app, you'd filter by employer ID)
        const employerJobs = allJobs.filter(job => job.company === (user?.name || 'Your Company'));
        setJobs(employerJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        Alert.alert('Error', 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  const handlePostJob = async () => {
    if (!newJob.title.trim() || !newJob.location.trim() || !newJob.minimumSalary.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const jobData = {
        title: newJob.title,
        company: newJob.company,
        jobType: newJob.jobType,
        location: newJob.location,
        workingHours: newJob.workingHours,
        minimumSalary: newJob.minimumSalary,
        requiredSkills: newJob.requiredSkills,
        learnableSkills: newJob.learnableSkills,
        experienceRequired: newJob.experienceRequired,
        trainingProvided: newJob.trainingProvided,
      };

      const createdJob = await apiService.createJob(jobData);
      setJobs(prev => [createdJob, ...prev]);
      
      // Reset form
      setNewJob({
        title: '',
        company: user?.name || 'Your Company',
        jobType: 'Other',
        location: '',
        workingHours: {
          weekday: '9 AM - 5 PM',
          weekend: 'Off'
        },
        minimumSalary: '',
        requiredSkills: ['Basic English'],
        learnableSkills: [],
        experienceRequired: '',
        trainingProvided: '',
      });
      
      setIsPostJobModalVisible(false);
      Alert.alert('Success', 'Job posted successfully!');
    } catch (error) {
      console.error('Error creating job:', error);
      Alert.alert('Error', 'Failed to post job. Please try again.');
    }
  };

  const handleDeleteJob = (jobId: string, jobTitle: string) => {
    Alert.alert(
      'Delete Job',
      `Are you sure you want to delete "${jobTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setJobs(prev => prev.filter(job => job.id !== jobId))
        }
      ]
    );
  };

  const renderJobItem = ({ item }: { item: any }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteJob(item.id, item.title)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.jobSalary}>{item.salary}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>
      
      <View style={styles.jobStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.applications}</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statText}>Posted: {item.postedDate}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statusBadge, { backgroundColor: item.status === 'active' ? '#34C759' : '#FF9500' }]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Status Section */}
      <View style={[styles.statusSection, { backgroundColor: '#007AFF' }]}>
        <Text style={[styles.subtitle, { color: 'white' }]}>Manage your job postings</Text>
        <Text style={[styles.stats, { color: 'rgba(255,255,255,0.8)' }]}>Posted: {jobs.length} • Active: {jobs.filter(j => j.status === 'active').length}</Text>
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.postJobButton}
            onPress={() => setIsPostJobModalVisible(true)}
          >
            <Text style={styles.postJobButtonText}>+ Post New Job</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Post Job Modal */}
      <Modal
        visible={isPostJobModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsPostJobModalVisible(false)}>
              <Text style={styles.modalCancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Post New Job</Text>
            <TouchableOpacity onPress={handlePostJob}>
              <Text style={styles.modalPostButton}>Post</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.modalInput}
              placeholder="Job Title *"
              value={newJob.title}
              onChangeText={(text) => setNewJob(prev => ({ ...prev, title: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Location *"
              value={newJob.location}
              onChangeText={(text) => setNewJob(prev => ({ ...prev, location: text }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Salary *"
              value={newJob.salary}
              onChangeText={(text) => setNewJob(prev => ({ ...prev, salary: text }))}
            />
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Job Description"
              value={newJob.description}
              onChangeText={(text) => setNewJob(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Admin home content (shows both user and employer views)
function AdminHomeContent() {
  const [viewMode, setViewMode] = useState<'user' | 'employer'>('user');
  
  return (
    <View style={styles.container}>
      {/* Admin Toggle */}
      <View style={[styles.statusSection, { backgroundColor: '#007AFF' }]}>
        <Text style={[styles.subtitle, { color: 'white' }]}>Admin Dashboard</Text>
        <View style={styles.adminToggle}>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'user' && styles.activeToggle]}
            onPress={() => setViewMode('user')}
          >
            <Text style={[styles.toggleText, viewMode === 'user' && styles.activeToggleText]}>User View</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, viewMode === 'employer' && styles.activeToggle]}
            onPress={() => setViewMode('employer')}
          >
            <Text style={[styles.toggleText, viewMode === 'employer' && styles.activeToggleText]}>Employer View</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Render selected view */}
      <View style={styles.contentContainer}>
        {viewMode === 'user' ? <UserHomeContent /> : <EmployerHomeContent />}
      </View>
    </View>
  );
} 