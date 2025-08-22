import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTabContext } from "./_layout";

// Sample job data for employer
const SAMPLE_POSTED_JOBS = [
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
];

export default function EmployerHomeScreen() {
  const [jobs, setJobs] = useState(SAMPLE_POSTED_JOBS);
  const [isPostJobModalVisible, setIsPostJobModalVisible] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    location: '',
    salary: '',
    description: '',
  });
  
  const { user } = useAuth();
  const { setActiveTab } = useTabContext();

  useFocusEffect(
    useCallback(() => {
      setActiveTab('employer-home');
    }, [setActiveTab])
  );

  const handlePostJob = () => {
    if (!newJob.title.trim() || !newJob.location.trim() || !newJob.salary.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const job = {
      id: Date.now().toString(),
      title: newJob.title,
      company: user?.name || 'Your Company',
      location: newJob.location,
      salary: newJob.salary,
      description: newJob.description,
      applications: 0,
      status: 'active',
      postedDate: new Date().toISOString().split('T')[0],
    };

    setJobs([job, ...jobs]);
    setNewJob({ title: '', location: '', salary: '', description: '' });
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
          onPress: () => {
            setJobs(jobs.filter(job => job.id !== jobId));
            Alert.alert('Success', 'Job deleted successfully!');
          },
        },
      ]
    );
  };

  const renderJobItem = ({ item }: { item: any }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.jobCompany}>{item.company}</Text>
          <Text style={styles.jobLocation}>📍 {item.location}</Text>
        </View>
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
      <View style={styles.statusSection}>
        <Text style={styles.subtitle}>Manage your job postings</Text>
        <Text style={styles.stats}>
          {jobs.length} active jobs • {jobs.reduce((sum, job) => sum + job.applications, 0)} total applications
        </Text>
      </View>

      {/* Post Job Button */}
      <View style={styles.postJobSection}>
        <TouchableOpacity
          style={styles.postJobButton}
          onPress={() => setIsPostJobModalVisible(true)}
        >
          <Text style={styles.postJobButtonText}>+ Post New Job</Text>
        </TouchableOpacity>
      </View>

      {/* Jobs List */}
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        style={styles.jobsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Jobs Posted Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start by posting your first job to attract candidates!
            </Text>
          </View>
        }
      />

      {/* Post Job Modal */}
      <Modal
        visible={isPostJobModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPostJobModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Post New Job</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Job Title *"
              value={newJob.title}
              onChangeText={(text) => setNewJob({ ...newJob, title: text })}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Location *"
              value={newJob.location}
              onChangeText={(text) => setNewJob({ ...newJob, location: text })}
            />
            
            <TextInput
              style={styles.modalInput}
              placeholder="Salary *"
              value={newJob.salary}
              onChangeText={(text) => setNewJob({ ...newJob, salary: text })}
            />
            
            <TextInput
              style={[styles.modalInput, styles.textArea]}
              placeholder="Job Description"
              value={newJob.description}
              onChangeText={(text) => setNewJob({ ...newJob, description: text })}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsPostJobModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.postButton}
                onPress={handlePostJob}
              >
                <Text style={styles.postButtonText}>Post Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  postJobSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  postJobButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  postJobButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  jobCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
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
    marginBottom: 8,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 16,
    color: '#666',
    marginBottom: 2,
  },
  jobLocation: {
    fontSize: 14,
    color: '#888',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
    lineHeight: 20,
    marginBottom: 12,
  },
  jobStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
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
    borderRadius: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  postButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
