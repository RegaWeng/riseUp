import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TRAINING_DATA, useSaved } from "../context/SavedContext";
import { useTabContext } from "./_layout";

const SKILL_CATEGORIES = [
  { name: 'Customer Service', color: '#007AFF', count: 2 },
  { name: 'Driving', color: '#FF9500', count: 2 },
  { name: 'Cleaning', color: '#34C759', count: 2 },
  { name: 'Food Service', color: '#FF3B30', count: 1 },
  { name: 'Warehouse', color: '#5856D6', count: 1 },
];

export default function TrainingScreen() {
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
  const { setActiveTab } = useTabContext();

  // Set active tab when screen is focused
  useFocusEffect(
    useCallback(() => {
      setActiveTab('training');
    }, [setActiveTab])
  );

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

  // Simple progress circle (text-based for now)
  const renderProgressCircle = () => (
    <View style={styles.progressCircle}>
      <Text style={styles.progressPercentage}>{progressPercentage}%</Text>
      <Text style={styles.progressLabel}>Complete</Text>
      <Text style={styles.progressCount}>
        {completedCount} of {totalVideos} videos
      </Text>
    </View>
  );

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
      {/* Status Section */}
      <View style={styles.statusSection}>
        <Text style={styles.subtitle}>Build skills for better opportunities</Text>
        {savedVideos.length > 0 && (
          <Text style={styles.savedCount}>
            ⭐ {savedVideos.length} video{savedVideos.length !== 1 ? 's' : ''} saved
          </Text>
        )}
      </View>

      {/* Progress Section */}
      <View style={styles.progressSection}>
        {renderProgressCircle()}
        <View style={styles.progressText}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Text style={styles.progressSubtitle}>
            Keep learning to unlock better job opportunities!
          </Text>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Choose a skill category:</Text>
        {renderCategoryFilter()}
      </View>

      {/* Video List */}
      <View style={styles.videoSection}>
        <Text style={styles.videoSectionTitle}>
          {selectedCategory === 'All' ? 'All Training Videos' : `${selectedCategory} Training`} ({filteredVideos.length})
        </Text>
        
        <FlatList
          data={filteredVideos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.videoList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statusSection: {
    backgroundColor: '#34C759',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
    fontWeight: '600',
    marginBottom: 8,
  },
  savedCount: {
    fontSize: 14,
    color: 'white',
    marginTop: 8,
    opacity: 0.9,
  },
  progressSection: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  progressLabel: {
    fontSize: 10,
    color: 'white',
    opacity: 0.8,
  },
  progressCount: {
    fontSize: 8,
    color: 'white',
    opacity: 0.8,
  },
  progressText: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  progressSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
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
  videoSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  videoSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  videoList: {
    paddingBottom: 20,
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
}); 