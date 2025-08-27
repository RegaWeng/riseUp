import { useEffect, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from '../../context/AuthContext';
import { useSaved } from '../../context/SavedContext';
import { apiService } from '../../services/api';



// Jobs will be fetched from API

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
  const [removedJobs, setRemovedJobs] = useState<string[]>([]);
  const [showNoExperienceOnly, setShowNoExperienceOnly] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const fetchedJobs = await apiService.getJobs();
        // Transform backend data to match frontend format
        const transformedJobs = fetchedJobs.map((job: any) => ({
          id: job._id,
          title: job.title,
          company: job.company,
          jobType: job.jobType,
          location: job.location,
          salary: job.minimumSalary,
          skills: job.requiredSkills,
          trainingProvided: job.trainingProvided,
          workingHours: job.workingHours,
          noExperienceNeeded: job.experienceRequired === "No experience needed"
        }));
        setJobs(transformedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        Alert.alert('Error', 'Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter jobs based on search text, no-experience filter, approval status, and exclude removed jobs
  const filteredJobs = jobs.filter(job => 
    !removedJobs.includes(job.id) && // Don't show removed jobs
    (job.title.toLowerCase().includes(searchText.toLowerCase()) ||
    job.company.toLowerCase().includes(searchText.toLowerCase()) ||
    job.skills.some((skill: string) => skill.toLowerCase().includes(searchText.toLowerCase()))) &&
    (!showNoExperienceOnly || job.noExperienceNeeded) && // Show only no-experience jobs when filter is on
    true // TODO: Add user role check for approval status
  );

  // Handle job application using shared context
  const handleApply = async (jobId: string, jobTitle: string) => {
    if (isJobApplied(jobId)) {
      console.log(`Already applied to ${jobTitle}`);
      return;
    }

    try {
      await applyToJob(jobId);
      console.log(`Application submitted for ${jobTitle}`);
      Alert.alert('Success', 'Application submitted successfully!');
    } catch (error) {
      console.error('Error applying to job:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
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



  // Calculate counts for status display
  const applicationCount = appliedJobs.length;
  const savedCount = savedJobs.length;
  const removedCount = removedJobs.length;

  const renderJobItem = ({ item }: { item: any }) => {
    const hasApplied = isJobApplied(item.id);
    const isSaved = isJobSaved(item.id);

    return (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <View style={styles.jobActions}>
            <TouchableOpacity 
              style={[
                styles.starButton,
                isSaved && styles.savedStarButton
              ]}
              onPress={() => isSaved ? unsaveJob(item.id) : saveJob(item)}
            >
              <Text style={[
                styles.starButtonText,
                isSaved && styles.savedStarButtonText
              ]}>
                {isSaved ? '★' : '☆'}
              </Text>
            </TouchableOpacity>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveJob(item.id, item.title)}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.company}>{item.company}</Text>
        {item.jobType && (
          <Text style={styles.jobType}>📋 {item.jobType}</Text>
        )}
        <Text style={styles.location}>{item.location}</Text>
        {item.workingHours && (
          <View style={styles.workingHoursContainer}>
            <Text style={styles.workingHoursLabel}>🕒 Working Hours:</Text>
            <Text style={styles.workingHoursText}>
              Weekdays: {item.workingHours.weekday || 'Not specified'}
            </Text>
            <Text style={styles.workingHoursText}>
              Weekends: {item.workingHours.weekend || 'Not specified'}
            </Text>
          </View>
        )}
        <Text style={styles.salary}>
          {item.salary.includes('$') ? item.salary : `$${item.salary}`}
          {!item.salary.toLowerCase().includes('hour') && !item.salary.toLowerCase().includes('/') ? ' per hour' : ''}
        </Text>
        
        <View style={styles.skillsContainer}>
          {item.skills.map((skill: string, index: number) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
        
        {item.trainingProvided && (
          <View style={styles.trainingContainer}>
            <Text style={styles.trainingLabel}>🎓 Training Provided:</Text>
            <Text style={styles.trainingText}>{item.trainingProvided}</Text>
          </View>
        )}
        
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

      {/* Filter Toggle */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterToggle,
            showNoExperienceOnly && styles.filterToggleActive
          ]}
          onPress={() => setShowNoExperienceOnly(!showNoExperienceOnly)}
        >
          <Text style={[
            styles.filterToggleText,
            showNoExperienceOnly && styles.filterToggleTextActive
          ]}>
            ✨ No experience needed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Job List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id || item._id}
        style={styles.jobList}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10
        }}
      />
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
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  filterToggle: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    alignSelf: 'flex-start',
  },
  filterToggleActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterToggleText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterToggleTextActive: {
    color: 'white',
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
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  savedStarButton: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  starButtonText: {
    fontSize: 16,
    color: '#ccc',
  },
  savedStarButtonText: {
    color: '#FFF',
  },
  company: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  jobType: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
    fontWeight: '500',
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
  trainingContainer: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  trainingLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  trainingText: {
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
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
  activeBadge: {
    backgroundColor: '#34C759', // Green
  },
  preparingBadge: {
    backgroundColor: '#8E8E93', // Grey
  },
  rejectedBadge: {
    backgroundColor: '#FF3B30', // Red
  },
  adminActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#34C759',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  adminToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 4,
    marginTop: 12,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: 'white',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
  },
  activeToggleText: {
    color: '#007AFF',
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
  jobSalary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  contentContainer: {
    padding: 20,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 50,
  },
  salaryPrefix: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginRight: 4,
  },
  salaryInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  salarySuffix: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666',
  },
  categoryModalContent: {
    padding: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 8,
  },
  selectedSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  selectedSkillTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  selectedSkillText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  disabledItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#ccc',
  },
  workingHoursContainer: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#28a745',
  },
  workingHoursLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#28a745',
    marginBottom: 4,
  },
  workingHoursText: {
    fontSize: 11,
    color: '#555',
    lineHeight: 14,
  },
});

// Employer home content (job posting)
function EmployerHomeContent() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const fetchedJobs = await apiService.getJobs();
        // Add applications count for display consistency
        const jobsWithApplications = fetchedJobs.map((job: any) => ({
          ...job,
          applications: job.applications || 0
        }));
        setJobs(jobsWithApplications);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        Alert.alert('Error', 'Failed to load jobs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);
  
  const [isPostJobModalVisible, setIsPostJobModalVisible] = useState(false);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isSkillsModalVisible, setIsSkillsModalVisible] = useState(false);
  
  const jobCategories = [
    "Cleaning & Maintenance",
    "Retail & Sales", 
    "Food Services",
    "Warehouse & Logistics",
    "Customer Service",
    "Delivery & Transportation",
    "Healthcare Support",
    "Administrative Assistant",
    "Security",
    "Other"
  ];

  const skillsCategories = [
    "Basic English",
    "Customer service",
    "Cash handling",
    "Communication",
    "Physical stamina",
    "Attention to detail",
    "Teamwork",
    "Time management",
    "Reliability",
    "Problem solving",
    "Computer skills",
    "Driving license",
    "Food safety",
    "Equipment operation",
    "Safety protocols",
    "Lifting ability",
    "Organization",
    "Multitasking",
    "Phone etiquette",
    "Clear speaking"
  ];

  const handleCategorySelect = (category: string) => {
    setNewJob(prev => ({ ...prev, jobType: category }));
    setIsCategoryModalVisible(false);
  };

  const handleSkillToggle = (skill: string) => {
    setNewJob(prev => {
      const currentSkills = prev.requiredSkills;
      const hasSkill = currentSkills.includes(skill);
      
      if (hasSkill) {
        // Remove skill
        return {
          ...prev,
          requiredSkills: currentSkills.filter(s => s !== skill)
        };
      } else {
        // Add skill if under limit
        if (currentSkills.length < 3) {
          return {
            ...prev,
            requiredSkills: [...currentSkills, skill]
          };
        }
        return prev; // Don't add if already at limit
      }
    });
  };

  const [newJob, setNewJob] = useState({
    title: '',
    jobType: '',
    location: '',
    workingHours: { weekday: '', weekend: '' },
    minimumSalary: '',
    experienceRequired: '',
    trainingProvided: '',
    requiredSkills: ['Basic English'],
    description: '',
  });

  const handlePostJob = async () => {
    if (!newJob.title.trim() || !newJob.location.trim() || !newJob.minimumSalary.trim() || !newJob.jobType.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const job = {
      title: newJob.title,
      company: 'Your Company', // In real app, get from user profile
      jobType: newJob.jobType || 'Other', // Default to 'Other' if empty
      location: newJob.location,
      workingHours: {
        weekday: newJob.workingHours.weekday || '9:00 AM - 5:00 PM',
        weekend: newJob.workingHours.weekend || 'Off'
      },
      minimumSalary: newJob.minimumSalary,
      experienceRequired: newJob.experienceRequired || 'No experience needed',
      trainingProvided: newJob.trainingProvided || 'Training will be provided',
      requiredSkills: newJob.requiredSkills
    };

    try {
      const createdJob = await apiService.createJob(job);
      // Add applications count for display consistency
      const jobWithApplications = { ...createdJob, applications: 0 };
      setJobs(prev => [jobWithApplications, ...prev]);
    } catch (error) {
      console.error('Error creating job:', error);
      Alert.alert('Error', 'Failed to create job');
      return;
    }
    setNewJob({ 
      title: '', 
      jobType: '', 
      location: '', 
      workingHours: { weekday: '', weekend: '' },
      minimumSalary: '', 
      experienceRequired: '', 
      trainingProvided: '', 
      requiredSkills: ['Basic English'],
      description: '' 
    });
    setIsPostJobModalVisible(false);
    Alert.alert('Success', 'Job posted successfully!');
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
          onPress: async () => {
            try {
              await apiService.deleteJob(jobId);
              setJobs(prev => prev.filter(job => job._id !== jobId));
            } catch (error) {
              console.error('Error deleting job:', error);
              Alert.alert('Error', 'Failed to delete job');
            }
          }
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
          onPress={() => handleDeleteJob(item._id, item.title)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.company}>{item.company}</Text>
      {item.jobType && (
        <Text style={styles.jobType}>📋 {item.jobType}</Text>
      )}
      <Text style={styles.location}>{item.location}</Text>
      {item.workingHours && (
        <View style={styles.workingHoursContainer}>
          <Text style={styles.workingHoursLabel}>🕒 Working Hours:</Text>
          <Text style={styles.workingHoursText}>
            Weekdays: {item.workingHours.weekday || 'Not specified'}
          </Text>
          <Text style={styles.workingHoursText}>
            Weekends: {item.workingHours.weekend || 'Not specified'}
          </Text>
        </View>
      )}
      <Text style={styles.salary}>
        Minimum {item.minimumSalary && item.minimumSalary.includes('$') ? item.minimumSalary : `$${item.minimumSalary || 'Not specified'}`}
        {item.minimumSalary && !item.minimumSalary.toLowerCase().includes('hour') && !item.minimumSalary.toLowerCase().includes('/') ? '/hour' : ''}
      </Text>
      <Text style={styles.jobDescription}>{item.trainingProvided || 'No training information provided'}</Text>
      
      <View style={styles.jobStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{item.applications}</Text>
          <Text style={styles.statLabel}>Applications</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statText}>
            Posted: {item.datePosted ? new Date(item.datePosted).toLocaleDateString() : 'Recently'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[
            styles.statusBadge,
            item.approvalStatus === 'active' && styles.activeBadge,
            item.approvalStatus === 'preparing' && styles.preparingBadge,
            item.approvalStatus === 'rejected' && styles.rejectedBadge
          ]}>
            {item.approvalStatus === 'active' ? 'Active' :
             item.approvalStatus === 'preparing' ? 'Preparing' : 'Rejected'}
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
          keyExtractor={(item) => item._id || item.id}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10
          }}
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
            
            {/* Job Category Dropdown */}
            <TouchableOpacity
              style={[styles.modalInput, styles.dropdownButton]}
              onPress={() => setIsCategoryModalVisible(true)}
            >
              <Text style={[styles.dropdownText, !newJob.jobType && styles.placeholderText]}>
                {newJob.jobType || 'Select Job Category *'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.modalInput}
              placeholder="Location *"
              value={newJob.location}
              onChangeText={(text) => setNewJob(prev => ({ ...prev, location: text }))}
            />
            
            {/* Working Hours */}
            <Text style={styles.sectionLabel}>Working Hours</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Weekday Hours (e.g. 9:00 AM - 5:00 PM)"
              value={newJob.workingHours.weekday}
              onChangeText={(text) => setNewJob(prev => ({ 
                ...prev, 
                workingHours: { ...prev.workingHours, weekday: text }
              }))}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Weekend Hours (e.g. 10:00 AM - 4:00 PM or Off)"
              value={newJob.workingHours.weekend}
              onChangeText={(text) => setNewJob(prev => ({ 
                ...prev, 
                workingHours: { ...prev.workingHours, weekend: text }
              }))}
            />
            
            <View style={styles.salaryContainer}>
              <Text style={styles.salaryPrefix}>$</Text>
              <TextInput
                style={styles.salaryInput}
                placeholder="15-18"
                value={newJob.minimumSalary}
                onChangeText={(text) => setNewJob(prev => ({ ...prev, minimumSalary: text }))}
                keyboardType="numeric"
              />
              <Text style={styles.salarySuffix}>per hour *</Text>
            </View>
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Job Description"
              value={newJob.description}
              onChangeText={(text) => setNewJob(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
            />
            <TextInput
              style={[styles.modalInput, styles.modalTextArea]}
              placeholder="Training you'll provide (e.g. 2 weeks on-the-job training, skills you'll teach)"
              value={newJob.trainingProvided}
              onChangeText={(text) => setNewJob(prev => ({ ...prev, trainingProvided: text }))}
              multiline
              numberOfLines={3}
            />

            {/* Required Skills Selector */}
            <Text style={styles.sectionLabel}>Required Skills (Max 3)</Text>
            <TouchableOpacity
              style={[styles.modalInput, styles.dropdownButton]}
              onPress={() => setIsSkillsModalVisible(true)}
            >
              <Text style={[styles.dropdownText, newJob.requiredSkills.length === 0 && styles.placeholderText]}>
                {newJob.requiredSkills.length > 0 
                  ? `${newJob.requiredSkills.length} skills selected` 
                  : 'Select required skills'
                }
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            
            {/* Show selected skills */}
            {newJob.requiredSkills.length > 0 && (
              <View style={styles.selectedSkillsContainer}>
                {newJob.requiredSkills.map((skill, index) => (
                  <View key={index} style={styles.selectedSkillTag}>
                    <Text style={styles.selectedSkillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Category Selection Modal */}
      <Modal
        visible={isCategoryModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)}>
              <Text style={styles.modalCancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Category</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={styles.categoryModalContent}>
            {jobCategories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => handleCategorySelect(category)}
              >
                <Text style={styles.categoryText}>{category}</Text>
                {newJob.jobType === category && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}

          </View>
        </View>
      </Modal>

      {/* Skills Selection Modal */}
      <Modal
        visible={isSkillsModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setIsSkillsModalVisible(false)}>
              <Text style={styles.modalCancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Skills ({newJob.requiredSkills.length}/3)</Text>
            <TouchableOpacity onPress={() => setIsSkillsModalVisible(false)}>
              <Text style={styles.modalPostButton}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoryModalContent}>
            {skillsCategories.map((skill, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryItem,
                  newJob.requiredSkills.length >= 3 && !newJob.requiredSkills.includes(skill) && styles.disabledItem
                ]}
                onPress={() => handleSkillToggle(skill)}
                disabled={newJob.requiredSkills.length >= 3 && !newJob.requiredSkills.includes(skill)}
              >
                <Text style={[
                  styles.categoryText,
                  newJob.requiredSkills.length >= 3 && !newJob.requiredSkills.includes(skill) && styles.disabledText
                ]}>
                  {skill}
                </Text>
                {newJob.requiredSkills.includes(skill) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Admin approval content for pending jobs
function AdminApprovalContent() {
  const { user } = useAuth();
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      setLoading(true);
      const jobs = await apiService.getPendingJobs();
      setPendingJobs(jobs);
    } catch (error) {
      console.error('Error fetching pending jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveJob = async (jobId: string) => {
    try {
      await apiService.approveJob(jobId, user?._id || '');
      // Refresh pending jobs
      fetchPendingJobs();
    } catch (error) {
      console.error('Error approving job:', error);
    }
  };

  const handleRejectJob = async (jobId: string, reason?: string) => {
    try {
      await apiService.rejectJob(jobId, user?._id || '', reason);
      // Refresh pending jobs
      fetchPendingJobs();
    } catch (error) {
      console.error('Error rejecting job:', error);
    }
  };

  const renderPendingJobItem = ({ item }: { item: any }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, styles.preparingBadge]}>
          <Text style={styles.statusBadge}>Pending Review</Text>
        </View>
      </View>
      <Text style={styles.company}>{item.company}</Text>
      <Text style={styles.company}>{item.jobType}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text style={styles.jobSalary}>
        Minimum ${item.minimumSalary} per hour
      </Text>
      
      {item.trainingProvided && (
        <Text style={styles.jobDescription}>{item.trainingProvided}</Text>
      )}

      <View style={styles.adminActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => handleApproveJob(item._id)}
        >
          <Text style={styles.actionButtonText}>✓ Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.rejectButton]}
          onPress={() => handleRejectJob(item._id, 'Does not meet requirements')}
        >
          <Text style={styles.actionButtonText}>✕ Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.statusSection, { backgroundColor: '#FF9500' }]}>
        <Text style={[styles.subtitle, { color: 'white' }]}>Job Approval Queue</Text>
        <Text style={[styles.stats, { color: 'rgba(255,255,255,0.8)' }]}>
          {pendingJobs.length} jobs pending review
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading pending jobs...</Text>
        </View>
      ) : pendingJobs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No jobs pending approval</Text>
          <Text style={styles.emptyText}>Create a job as employer first, then it will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={pendingJobs}
          renderItem={renderPendingJobItem}
          keyExtractor={(item) => item._id}
          style={styles.jobList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

export default function Home() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'user' | 'employer' | 'admin'>('user');

  // If admin, show admin dashboard with toggle options
  if (user?.type === 'admin') {
    return (
      <View style={styles.container}>
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
            <TouchableOpacity 
              style={[styles.toggleButton, viewMode === 'admin' && styles.activeToggle]}
              onPress={() => setViewMode('admin')}
            >
              <Text style={[styles.toggleText, viewMode === 'admin' && styles.activeToggleText]}>Admin Panel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {viewMode === 'admin' ? <AdminApprovalContent /> :
         viewMode === 'user' ? <UserHomeContent /> : <EmployerHomeContent />}
      </View>
    );
  }

  // Otherwise show user or employer content based on role
  return (
    <View style={styles.container}>
      {user?.type === 'employer' ? <EmployerHomeContent /> : <UserHomeContent />}
    </View>
  );
}