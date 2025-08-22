import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTabContext } from "./_layout";

// Sample starred candidates data
const SAMPLE_STARRED_CANDIDATES = [
  {
    id: '1',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    phone: '+1 (555) 345-6789',
    jobTitle: 'Cashier',
    starredDate: '2024-01-18',
    experience: '1 year customer service',
    skills: ['customer service', 'multitasking', 'teamwork'],
    notes: 'Great communication skills, very enthusiastic',
  },
  {
    id: '2',
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1 (555) 456-7890',
    jobTitle: 'Delivery Driver',
    starredDate: '2024-01-17',
    experience: '5 years driving experience',
    skills: ['driving license', 'navigation', 'time management', 'customer service'],
    notes: 'Excellent driving record, punctual',
  },
];

export default function EmployerSavedScreen() {
  const [starredCandidates, setStarredCandidates] = useState(SAMPLE_STARRED_CANDIDATES);
  
  const { user } = useAuth();
  const { setActiveTab } = useTabContext();

  useFocusEffect(
    useCallback(() => {
      setActiveTab('employer-saved');
    }, [setActiveTab])
  );

  const handleRemoveFromStarred = (candidateId: string, candidateName: string) => {
    setStarredCandidates(prev => prev.filter(candidate => candidate.id !== candidateId));
    // In a real app, you might want to show a confirmation dialog
  };

  const renderStarredCandidateItem = ({ item }: { item: any }) => (
    <View style={styles.candidateCard}>
      <View style={styles.candidateHeader}>
        <View style={styles.candidateInfo}>
          <Text style={styles.candidateName}>{item.name}</Text>
          <Text style={styles.candidateJob}>{item.jobTitle}</Text>
          <Text style={styles.candidateContact}>📧 {item.email}</Text>
          <Text style={styles.candidateContact}>📞 {item.phone}</Text>
        </View>
                 <TouchableOpacity
           style={styles.starButton}
           onPress={() => handleRemoveFromStarred(item.id, item.name)}
         >
           <Text style={styles.starButtonText}>★</Text>
         </TouchableOpacity>
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
      
      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}
      
      <View style={styles.candidateActions}>
        <Text style={styles.starredDate}>Starred: {item.starredDate}</Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>Contact</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.interviewButton}>
            <Text style={styles.interviewButtonText}>Schedule Interview</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Status Section */}
      <View style={styles.statusSection}>
        <Text style={styles.subtitle}>Your shortlisted candidates</Text>
        <Text style={styles.stats}>
          ⭐ {starredCandidates.length} candidates shortlisted
        </Text>
      </View>

      {/* Starred Candidates List */}
      <FlatList
        data={starredCandidates}
        renderItem={renderStarredCandidateItem}
        keyExtractor={(item) => item.id}
        style={styles.candidatesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Shortlisted Candidates</Text>
            <Text style={styles.emptySubtitle}>
              Shortlist promising candidates from the Applicants tab to see them here.
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
  candidatesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  candidateCard: {
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
  candidateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  candidateJob: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 4,
  },
  candidateContact: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  starButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starButtonText: {
    fontSize: 16,
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
  notesContainer: {
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  candidateActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starredDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  contactButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  interviewButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  interviewButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
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
