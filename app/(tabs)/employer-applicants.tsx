import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTabContext } from "./_layout";

// Sample applicants data
const SAMPLE_APPLICANTS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Cashier',
    appliedDate: '2024-01-20',
    status: 'pending',
    experience: '2 years retail',
    skills: ['customer service', 'cash handling', 'communication'],
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '+1 (555) 234-5678',
    jobTitle: 'Delivery Driver',
    appliedDate: '2024-01-19',
    status: 'reviewed',
    experience: '3 years driving',
    skills: ['driving license', 'navigation', 'time management'],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '+1 (555) 345-6789',
    jobTitle: 'Cashier',
    appliedDate: '2024-01-18',
    status: 'shortlisted',
    experience: '1 year customer service',
    skills: ['customer service', 'multitasking', 'teamwork'],
  },
];

export default function EmployerApplicantsScreen() {
  const [applicants, setApplicants] = useState(SAMPLE_APPLICANTS);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const { user } = useAuth();
  const { setActiveTab } = useTabContext();

  useFocusEffect(
    useCallback(() => {
      setActiveTab('employer-applicants');
    }, [setActiveTab])
  );

  const filteredApplicants = selectedFilter === 'all' 
    ? applicants 
    : applicants.filter(applicant => applicant.status === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'reviewed': return '#007AFF';
      case 'shortlisted': return '#34C759';
      case 'rejected': return '#FF3B30';
      default: return '#666';
    }
  };

  const handleStatusChange = (applicantId: string, newStatus: string) => {
    setApplicants(prev => 
      prev.map(applicant => 
        applicant.id === applicantId 
          ? { ...applicant, status: newStatus }
          : applicant
      )
    );
  };

  const renderApplicantItem = ({ item }: { item: any }) => (
    <View style={styles.applicantCard}>
      <View style={styles.applicantHeader}>
        <View style={styles.applicantInfo}>
          <Text style={styles.applicantName}>{item.name}</Text>
          <Text style={styles.applicantJob}>{item.jobTitle}</Text>
          <Text style={styles.applicantContact}>📧 {item.email}</Text>
          <Text style={styles.applicantContact}>📞 {item.phone}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.experienceText}>Experience: {item.experience}</Text>
      
      <View style={styles.skillsContainer}>
        <Text style={styles.skillsLabel}>Skills:</Text>
        <View style={styles.skillsList}>
          {item.skills.map((skill: string, index: number) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.applicantActions}>
        <Text style={styles.appliedDate}>Applied: {item.appliedDate}</Text>
        
        <View style={styles.statusButtons}>
                     <TouchableOpacity
             style={[styles.statusButton, item.status === 'shortlisted' && styles.activeStatusButton]}
             onPress={() => handleStatusChange(item.id, 'shortlisted')}
           >
             <Text style={[styles.statusButtonText, item.status === 'shortlisted' && styles.activeStatusButtonText]}>
               Starred
             </Text>
           </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.statusButton, item.status === 'rejected' && styles.rejectStatusButton]}
            onPress={() => handleStatusChange(item.id, 'rejected')}
          >
            <Text style={[styles.statusButtonText, item.status === 'rejected' && styles.rejectStatusButtonText]}>
              Reject
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Status Section */}
      <View style={styles.statusSection}>
        <Text style={styles.subtitle}>Manage job applications</Text>
        <Text style={styles.stats}>
          {applicants.length} total applications • {applicants.filter(a => a.status === 'shortlisted').length} shortlisted
        </Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Filter by status:</Text>
        <View style={styles.filterButtons}>
          {['all', 'pending', 'reviewed', 'shortlisted', 'rejected'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.activeFilterButtonText,
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Applicants List */}
      <FlatList
        data={filteredApplicants}
        renderItem={renderApplicantItem}
        keyExtractor={(item) => item.id}
        style={styles.applicantsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Applications Yet</Text>
            <Text style={styles.emptySubtitle}>
              Applications will appear here once candidates apply to your jobs.
            </Text>
          </View>
        }
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
  filterSection: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  applicantsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  applicantCard: {
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
  applicantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  applicantJob: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  applicantContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  experienceText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  skillsContainer: {
    marginBottom: 12,
  },
  skillsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 12,
    color: '#666',
  },
  applicantActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appliedDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeStatusButton: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  rejectStatusButton: {
    backgroundColor: '#FF3B30',
    borderColor: '#FF3B30',
  },
  statusButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeStatusButtonText: {
    color: 'white',
  },
  rejectStatusButtonText: {
    color: 'white',
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
});
