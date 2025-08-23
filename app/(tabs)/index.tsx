import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
  const [searchText, setSearchText] = useState("");
  const [removedJobs, setRemovedJobs] = useState<string[]>([]);
  
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

  // Handle saving job using shared context
  const handleSaveJob = (jobId: string, jobTitle: string) => {
    const job = SAMPLE_JOBS.find(j => j.id === jobId);
    if (!job) return;

    if (isJobSaved(jobId)) {
      // Already saved - unsave it
      unsaveJob(jobId);
      console.log(`Job unsaved: ${jobTitle}`);
    } else {
      // Not saved - save it
      const savedJob = {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        skills: job.skills,
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

  const renderJobItem = ({ item }: { item: any }) => {
    const hasApplied = isJobApplied(item.id);
    const isSaved = isJobSaved(item.id);

    return (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveJob(item.id, item.title)}
          >
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
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
      <View style={styles.statusSection}>
        <Text style={styles.subtitle}>Find your next opportunity</Text>
        <Text style={styles.stats}>
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
}); 