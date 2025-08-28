import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import { TRAINING_DATA, useSaved } from "../../context/SavedContext";
import { apiService, Application } from '../../services/api';


const SKILL_CATEGORIES = [
  { name: 'Customer Service', color: '#007AFF', count: 2 },
  { name: 'Driving', color: '#FF9500', count: 2 },
  { name: 'Cleaning', color: '#34C759', count: 2 },
  { name: 'Food Service', color: '#FF3B30', count: 1 },
  { name: 'Warehouse', color: '#5856D6', count: 1 },
];

export default function TrainingScreen() {
  const { user } = useAuth();
  const { isAdminView, viewMode, setViewMode } = useAdmin();
  
  // Show different content based on user type and admin view
  if (user?.type === 'employer' || (isAdminView && viewMode === 'employer')) {
    return <EmployerTrainingContent />;
  }
  
  // Default training videos for regular users and admin in user view
  return <UserTrainingContent />;
}

// User training content (original training videos)
function UserTrainingContent() {
  const { isAdminView, viewMode, setViewMode } = useAdmin();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Use shared context for everything
  const { 
    savedVideos, 
    saveVideo, 
    unsaveVideo, 
    isVideoSaved, 
    completedVideos, 
    completeVideo, 
    isVideoCompleted 
  } = useSaved();

  // Use tab context to update header color


  // Set active tab when screen is focused


  // Filter videos by selected category
  const filteredVideos = selectedCategory === 'All' 
    ? TRAINING_DATA 
    : TRAINING_DATA.filter(video => video.category === selectedCategory);

  // Calculate progress
  const totalVideos = TRAINING_DATA.length;
  const completedCount = completedVideos.length;
  const progressPercentage = Math.round((completedCount / totalVideos) * 100);

  // Handle video completion using shared context
  const handleVideoComplete = (videoId: string, videoTitle: string) => {
    if (isVideoCompleted(videoId)) {
      console.log(`${videoTitle} already completed`);
      return;
    }

    completeVideo(videoId);
    console.log(`Video completed: ${videoTitle}`);
  };

  // Handle saving video using shared context
  const handleSaveVideo = (videoId: string, videoTitle: string) => {
    const video = TRAINING_DATA.find(v => v.id === videoId);
    if (!video) return;

    if (isVideoSaved(videoId)) {
      // Already saved - unsave it
      unsaveVideo(videoId);
      console.log(`Video unsaved: ${videoTitle}`);
    } else {
      // Not saved - save it
      const savedVideoData = {
        id: video.id,
        title: video.title,
        category: video.category,
        duration: video.duration,
        description: video.description,
        skillsGained: video.skillsGained,
        savedDate: new Date().toISOString(),
        type: 'video' as const,
      };
      saveVideo(savedVideoData);
      console.log(`Video saved: ${videoTitle}`);
    }
  };



  // Render category filter buttons
  const renderCategoryFilter = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedCategory === 'All' && styles.categoryButtonActive
        ]}
        onPress={() => setSelectedCategory('All')}
      >
        <Text style={[
          styles.categoryButtonText,
          selectedCategory === 'All' && styles.categoryButtonTextActive
        ]}>
          All ({totalVideos})
        </Text>
      </TouchableOpacity>
      
      {SKILL_CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.name}
          style={[
            styles.categoryButton,
            selectedCategory === category.name && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedCategory(category.name)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category.name && styles.categoryButtonTextActive
          ]}>
            {category.name} ({category.count})
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render each video item
  const renderVideoItem = ({ item }: { item: any }) => (
    <View style={styles.videoCard}>
      <View style={styles.videoHeader}>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoCategory}>{item.category}</Text>
        </View>
        <View style={styles.videoHeaderButtons}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              isVideoSaved(item.id) && styles.savedButton
            ]}
            onPress={() => handleSaveVideo(item.id, item.title)}
          >
            <Text style={[
              styles.saveButtonText,
              isVideoSaved(item.id) && styles.savedButtonText
            ]}>
              {isVideoSaved(item.id) ? "★" : "☆"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.videoDuration}>{item.duration}</Text>
        </View>
      </View>
      
      <Text style={styles.videoDescription}>{item.description}</Text>
      
      <View style={styles.skillsContainer}>
        <Text style={styles.skillsLabel}>Skills you'll gain:</Text>
        <View style={styles.skillsList}>
          {item.skillsGained.map((skill: string, index: number) => (
            <View key={index} style={styles.skillTag}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <TouchableOpacity
      
        style={[
          styles.watchButton,
          isVideoCompleted(item.id) && styles.completedButton
        ]}
        onPress={() => handleVideoComplete(item.id, item.title)}
      >
        <Text style={[
          styles.watchButtonText,
          isVideoCompleted(item.id) && styles.completedButtonText
        ]}>
          {isVideoCompleted(item.id) ? "✓ Completed" : "Watch Video"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Admin Toggle - Only show for admin users */}
      {isAdminView && (
        <View style={styles.adminToggleContainer}>
          <TouchableOpacity
            style={[
              styles.adminToggle,
              viewMode === 'user' && styles.adminToggleActive
            ]}
            onPress={() => setViewMode('user')}
          >
            <Text style={[
              styles.adminToggleText,
              viewMode === 'user' && styles.adminToggleTextActive
            ]}>
              User View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.adminToggle,
              viewMode === 'employer' && styles.adminToggleActive
            ]}
            onPress={() => setViewMode('employer')}
          >
            <Text style={[
              styles.adminToggleText,
              viewMode === 'employer' && styles.adminToggleTextActive
            ]}>
              Employer View
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status Section - Small like home page */}
      <View style={[styles.statusSection, { backgroundColor: '#34C759' }]}>
        <Text style={[styles.subtitle, { color: 'white' }]}>Build skills for better opportunities</Text>
        <Text style={[styles.stats, { color: 'rgba(255,255,255,0.8)' }]}>
          {progressPercentage}% complete • {completedCount} of {totalVideos} videos
          {savedVideos.length > 0 && ` • ⭐ ${savedVideos.length} saved`}
        </Text>
      </View>

      {/* Category Filter - Small section like search bar */}
      <View style={styles.filterSection}>
        {renderCategoryFilter()}
      </View>

      {/* Video List - Large scrollable area like home page */}
      <FlatList
        data={filteredVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        style={styles.videoList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.videoSectionTitle}>
            {selectedCategory === 'All' ? 'All Training Videos' : `${selectedCategory} Training`} ({filteredVideos.length})
          </Text>
        }
      />
    </View>
  );
}

// Employer training content (shows job applicants)
function EmployerTrainingContent() {
  const { isAdminView, viewMode, setViewMode } = useAdmin();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const apps = await apiService.getApplicationsForEmployer();
      setApplications(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      Alert.alert('Error', 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: Application['status']) => {
    try {
      await apiService.updateApplicationStatus(applicationId, newStatus);
      // Refresh applications
      fetchApplications();
      Alert.alert('Success', 'Application status updated');
    } catch (error) {
      console.error('Error updating application:', error);
      Alert.alert('Error', 'Failed to update application status');
    }
  };

  // Filter applications by status
  const filteredApplications = selectedStatus === 'All' 
    ? applications 
    : applications.filter(app => app.status === selectedStatus);

  // Count applications by status
  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    reviewed: applications.filter(app => app.status === 'reviewed').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  // Render status filter buttons
  const renderStatusFilter = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          selectedStatus === 'All' && styles.categoryButtonActive
        ]}
        onPress={() => setSelectedStatus('All')}
      >
        <Text style={[
          styles.categoryButtonText,
          selectedStatus === 'All' && styles.categoryButtonTextActive
        ]}>
          All ({statusCounts.all})
        </Text>
      </TouchableOpacity>
      
      {['pending', 'reviewed', 'shortlisted', 'rejected'].map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.categoryButton,
            selectedStatus === status && styles.categoryButtonActive
          ]}
          onPress={() => setSelectedStatus(status)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedStatus === status && styles.categoryButtonTextActive
          ]}>
            {status.charAt(0).toUpperCase() + status.slice(1)} ({statusCounts[status as keyof typeof statusCounts]})
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  // Render each application item
  const renderApplicationItem = ({ item }: { item: Application }) => (
    <View style={styles.videoCard}>
      <View style={styles.videoHeader}>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.user?.name || 'Unknown User'}</Text>
          <Text style={styles.videoCategory}>{item.user?.email || 'No email'}</Text>
        </View>
        <View style={styles.videoHeaderButtons}>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) }
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.videoDescription}>
        Applied for: {item.job?.title || 'Unknown Job'} at {item.job?.company || 'Unknown Company'}
      </Text>
      <Text style={styles.videoDescription}>
        Location: {item.job?.location || 'Unknown Location'}
      </Text>
      <Text style={styles.videoDescription}>
        Applied: {new Date(item.appliedDate).toLocaleDateString()}
      </Text>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#007AFF' }]}
          onPress={() => updateApplicationStatus(item._id, 'reviewed')}
        >
          <Text style={styles.actionButtonText}>Mark Reviewed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#34C759' }]}
          onPress={() => updateApplicationStatus(item._id, 'shortlisted')}
        >
          <Text style={styles.actionButtonText}>Shortlist</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF3B30' }]}
          onPress={() => updateApplicationStatus(item._id, 'rejected')}
        >
          <Text style={styles.actionButtonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#FF9500';
      case 'reviewed': return '#007AFF';
      case 'shortlisted': return '#34C759';
      case 'rejected': return '#FF3B30';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#34C759" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading applications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Admin Toggle - Only show for admin users */}
      {isAdminView && (
        <View style={styles.adminToggleContainer}>
          <TouchableOpacity
            style={[
              styles.adminToggle,
              viewMode === 'user' && styles.adminToggleActive
            ]}
            onPress={() => setViewMode('user')}
          >
            <Text style={[
              styles.adminToggleText,
              viewMode === 'user' && styles.adminToggleTextActive
            ]}>
              User View
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.adminToggle,
              viewMode === 'employer' && styles.adminToggleActive
            ]}
            onPress={() => setViewMode('employer')}
          >
            <Text style={[
              styles.adminToggleText,
              viewMode === 'employer' && styles.adminToggleTextActive
            ]}>
              Employer View
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Status Section */}
      <View style={[styles.statusSection, { backgroundColor: '#34C759' }]}>
        <Text style={[styles.subtitle, { color: 'white' }]}>Job Applications Management</Text>
        <Text style={[styles.stats, { color: 'rgba(255,255,255,0.8)' }]}>
          {applications.length} total applications • {statusCounts.pending} pending review
        </Text>
      </View>

      {/* Status Filter */}
      <View style={styles.filterSection}>
        {renderStatusFilter()}
      </View>

      {/* Applications List */}
      <FlatList
        data={filteredApplications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => item._id}
        style={styles.videoList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.videoSectionTitle}>
            {selectedStatus === 'All' ? 'All Applications' : `${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)} Applications`} ({filteredApplications.length})
          </Text>
        }
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#666', fontSize: 16 }}>No applications found</Text>
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
  adminToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  adminToggle: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  adminToggleActive: {
    backgroundColor: '#34C759',
  },
  adminToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  adminToggleTextActive: {
    color: 'white',
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
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryButtonActive: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  videoList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  videoSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  videoCard: {
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
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  videoCategory: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  videoHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  savedButton: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ccc',
  },
  savedButtonText: {
    color: '#FFF',
  },
  videoDuration: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  skillsContainer: {
    marginBottom: 16,
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
  watchButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: '#007AFF',
  },
  watchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  completedButtonText: {
    color: 'white',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
}); 