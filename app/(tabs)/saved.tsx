import { SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AdminToggle } from "../components/AdminToggle";
import { useSaved } from "../context/SavedContext";


export default function SavedScreen() {
  // Use shared context for everything
  const { 
    savedJobs, 
    savedVideos, 
    unsaveJob, 
    unsaveVideo, 
    applyToJob, 
    withdrawJobApplication, 
    isJobApplied, 
    completeVideo, 
    isVideoCompleted 
  } = useSaved();

  // Use tab context to update header color


  // Set active tab when screen is focused


  // Handle job application from saved list using shared context
  const handleApplyToSavedJob = (jobId: string, jobTitle: string) => {
    if (isJobApplied(jobId)) {
      console.log(`Already applied to ${jobTitle}`);
      return;
    }
    
    applyToJob(jobId);
    console.log(`Applied to saved job: ${jobTitle}`);
  };

  // Handle video completion from saved list using shared context
  const handleWatchSavedVideo = (videoId: string, videoTitle: string) => {
    if (isVideoCompleted(videoId)) {
      console.log(`${videoTitle} already completed`);
      return;
    }

    completeVideo(videoId);
    console.log(`Completed saved video: ${videoTitle}`);
  };

  // Remove job from saved list
  const handleRemoveSavedJob = (jobId: string, jobTitle: string) => {
    unsaveJob(jobId);
    console.log(`Removed saved job: ${jobTitle}`);
  };

  // Remove video from saved list
  const handleRemoveSavedVideo = (videoId: string, videoTitle: string) => {
    unsaveVideo(videoId);
    console.log(`Removed saved video: ${videoTitle}`);
  };

  // Render saved job item
  const renderSavedJob = ({ item }: { item: any }) => (
    <View style={styles.savedCard}>
      <View style={styles.savedHeader}>
        <View style={styles.savedInfo}>
          <Text style={styles.savedTitle}>{item.title}</Text>
          <Text style={styles.savedCompany}>{item.company}</Text>
          <Text style={styles.savedLocation}>📍 {item.location}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveSavedJob(item.id, item.title)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.savedSalary}>{item.salary}</Text>
      
      <View style={styles.skillsContainer}>
        {item.skills.map((skill: string, index: number) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>

      <View style={styles.savedActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isJobApplied(item.id) && styles.appliedButton
          ]}
          onPress={() => handleApplyToSavedJob(item.id, item.title)}
        >
          <Text style={[
            styles.actionButtonText,
            isJobApplied(item.id) && styles.appliedButtonText
          ]}>
            {isJobApplied(item.id) ? "✓ Applied" : "Apply Now"}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.savedDate}>
          Saved {new Date(item.savedDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  // Render saved video item
  const renderSavedVideo = ({ item }: { item: any }) => (
    <View style={styles.savedCard}>
      <View style={styles.savedHeader}>
        <View style={styles.savedInfo}>
          <Text style={styles.savedTitle}>{item.title}</Text>
          <Text style={styles.savedCategory}>{item.category}</Text>
          <Text style={styles.savedDuration}>⏱️ {item.duration}</Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveSavedVideo(item.id, item.title)}
        >
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.savedDescription}>{item.description}</Text>
      
      <View style={styles.skillsContainer}>
        {item.skillsGained.map((skill: string, index: number) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
      </View>

      <View style={styles.savedActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            isVideoCompleted(item.id) && styles.completedButton
          ]}
          onPress={() => handleWatchSavedVideo(item.id, item.title)}
        >
          <Text style={[
            styles.actionButtonText,
            isVideoCompleted(item.id) && styles.completedButtonText
          ]}>
            {isVideoCompleted(item.id) ? "✓ Completed" : "Watch Video"}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.savedDate}>
          Saved {new Date(item.savedDate).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );

  // Prepare data for SectionList
  const sectionData = [
    {
      title: `Saved Jobs (${savedJobs.length})`,
      data: savedJobs,
      renderItem: renderSavedJob,
      emptyMessage: "No saved jobs yet. Save jobs from the Home tab to see them here!"
    },
    {
      title: `Saved Videos (${savedVideos.length})`,
      data: savedVideos,
      renderItem: renderSavedVideo,
      emptyMessage: "No saved videos yet. Save training videos from the Training tab!"
    }
  ];

  return (
    <View style={styles.container}>
      {/* Status Section - Small like home page */}
      <View style={[styles.statusSection, { backgroundColor: '#FF9500' }]}>
        <Text style={[styles.subtitle, { color: 'white' }]}>Your bookmarked jobs and training</Text>
        <Text style={[styles.stats, { color: 'rgba(255,255,255,0.8)' }]}>
          📌 {savedJobs.length + savedVideos.length} items saved
        </Text>
      </View>

      {/* Admin Toggle */}
      <AdminToggle />

      {/* Large scrollable content area like home page */}
      <SectionList
        sections={sectionData}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={({ item, section }) => section.renderItem({ item })}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderSectionFooter={({ section }) => (
          section.data.length === 0 ? (
            <View style={styles.emptySection}>
              <Text style={styles.emptyText}>{section.emptyMessage}</Text>
            </View>
          ) : null
        )}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Saved Items</Text>
            <Text style={styles.emptySubtitle}>
              Start saving jobs and training videos to build your personal collection!
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingTop: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  savedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  savedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  savedInfo: {
    flex: 1,
  },
  savedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  savedCompany: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  savedCategory: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
    marginBottom: 2,
  },
  savedLocation: {
    fontSize: 12,
    color: '#888',
  },
  savedDuration: {
    fontSize: 12,
    color: '#888',
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  savedSalary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },
  savedDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 11,
    color: '#666',
  },
  savedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#FF9500',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flex: 1,
    marginRight: 10,
  },
  appliedButton: {
    backgroundColor: '#007AFF',
  },
  completedButton: {
    backgroundColor: '#34C759',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  appliedButtonText: {
    color: 'white',
  },
  completedButtonText: {
    color: 'white',
  },
  savedDate: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  emptySection: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
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