import { useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';



// Sample job data - this would come from an API later
const SAMPLE_JOBS = [
  {
    id: '1',
    title: 'Cashier',
    company: 'Metro Grocery',
    location: 'Downtown',
    salary: '$15/hour',
    skills: ['customer service', 'cash handling', 'communication'],
    trainingProvided: '2 weeks on-the-job training, customer service skills',
    noExperienceNeeded: true,
  },
  {
    id: '2',
    title: 'Delivery Driver',
    company: 'QuickEats',
    location: 'City Wide',
    salary: '$18/hour + tips',
    skills: ['driving license', 'navigation', 'time management'],
    trainingProvided: '1 week app training, route optimization',
    noExperienceNeeded: false,
  },
  {
    id: '3',
    title: 'Cleaner',
    company: 'CleanCorp',
    location: 'Various Offices',
    salary: '$16/hour',
    skills: ['attention to detail', 'physical stamina', 'reliability'],
    trainingProvided: '3 days safety training, equipment use',
    noExperienceNeeded: true,
  },
  {
    id: '4',
    title: 'Warehouse Worker',
    company: 'LogiCorp',
    location: 'Industrial Park',
    salary: '$17/hour',
    skills: ['lifting', 'organization', 'teamwork'],
    trainingProvided: '1 week warehouse operations, safety protocols',
    noExperienceNeeded: false,
  },
  {
    id: '5',
    title: 'Food Service',
    company: 'Burger Palace',
    location: 'Mall',
    salary: '$14/hour',
    skills: ['food safety', 'multitasking', 'customer service'],
    trainingProvided: '2 weeks food prep training, hygiene standards',
    noExperienceNeeded: true,
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
  const [removedJobs, setRemovedJobs] = useState<string[]>([]);
  const [showNoExperienceOnly, setShowNoExperienceOnly] = useState(false);
  
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



  
  // Filter jobs based on search text, no-experience filter, and exclude removed jobs
  const filteredJobs = SAMPLE_JOBS.filter(job => 
    !removedJobs.includes(job.id) && // Don't show removed jobs
    (job.title.toLowerCase().includes(searchText.toLowerCase()) ||
    job.company.toLowerCase().includes(searchText.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchText.toLowerCase()))) &&
    (!showNoExperienceOnly || job.noExperienceNeeded) // Show only no-experience jobs when filter is on
  );

  // Handle job application using shared context
  const handleApply = (jobId: string, jobTitle: string) => {
    if (isJobApplied(jobId)) {
      console.log(`Already applied to ${jobTitle}`);
      return;
    }

    applyToJob(jobId);
    console.log(`Application submitted for ${jobTitle}`);
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
              style={styles.starButton}
              onPress={() => isSaved ? unsaveJob(item.id) : saveJob(item)}
            >
              <Text style={styles.starButtonText}>
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
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.salary}>{item.salary}</Text>
        
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
        keyExtractor={(item) => item.id}
        style={styles.jobList}
        showsVerticalScrollIndicator={false}
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
});

// Employer home content (job posting)
function EmployerHomeContent() {
  const [jobs, setJobs] = useState([
    {
      id: '1',
      title: 'Cashier',
      company: 'Metro Grocery',
      location: 'Downtown',
      salary: '$15/hour',
      description: 'Looking for a reliable cashier to join our team.',
      applications: 5,
      status: 'active',
      postedDate: '2024-01-15',
    },
    {
      id: '2',
      title: 'Delivery Driver',
      company: 'Metro Grocery',
      location: 'City Wide',
      salary: '$18/hour + tips',
      description: 'Experienced drivers needed for food delivery service.',
      applications: 3,
      status: 'active',
      postedDate: '2024-01-10',
    },
  ]);
  
  const [isPostJobModalVisible, setIsPostJobModalVisible] = useState(false);
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

  const handlePostJob = () => {
    if (!newJob.title.trim() || !newJob.location.trim() || !newJob.minimumSalary.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const job = {
      id: Date.now().toString(),
      title: newJob.title,
      company: 'Your Company', // In real app, get from user profile
      jobType: newJob.jobType,
      location: newJob.location,
      workingHours: newJob.workingHours,
      minimumSalary: newJob.minimumSalary,
      experienceRequired: newJob.experienceRequired,
      trainingProvided: newJob.trainingProvided,
      requiredSkills: newJob.requiredSkills,
      description: newJob.description,
      applications: 0,
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0],
    };

    setJobs(prev => [job, ...prev]);
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
              placeholder="Minimum Salary *"
              value={newJob.minimumSalary}
              onChangeText={(text) => setNewJob(prev => ({ ...prev, minimumSalary: text }))}
            />
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