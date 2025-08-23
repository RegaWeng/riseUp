import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useSaved } from "../context/SavedContext";


// User profile data - in a real app, this would come from user authentication/profile
const USER_PROFILE = {
  name: "Your Name",
  email: "your.email@example.com",
  phone: "+1 (555) 000-0000",
  address: "Your Address, City, State 00000",
  preferredLanguages: ["English"], // Changed to array for multiple languages
  profilePicture: null, // In a real app, this would be an image URI
  bio: "Motivated individual seeking opportunities to grow and contribute in a dynamic work environment.",
};

// Self-taught skills that user can add (predefined options)
const PREDEFINED_SELF_TAUGHT_SKILLS = [
  'Microsoft Office',
  'Basic Computer Skills',
  'Time Management',
  'Problem Solving',
  'Leadership',
  'Teamwork',
  'Communication',
  'Organization'
];

// Language options
const PREDEFINED_LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Arabic', 'Portuguese', 'Russian', 'Italian'];

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(USER_PROFILE);
  const [selectedSelfTaughtSkills, setSelectedSelfTaughtSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [customLanguageInput, setCustomLanguageInput] = useState("");
  
  // Get real data from context
  const { 
    savedJobs, 
    savedVideos, 
    completedVideos, 
    appliedJobs, 
    getCompletedVideosWithDetails 
  } = useSaved();

  // Get auth data
  const { user } = useAuth();

  // Use tab context to update header color


  // Set active tab when screen is focused


  // Get real completed training videos with their details
  const completedTrainingVideos = getCompletedVideosWithDetails();

  // Get all skills from completed training videos (starts at zero)
  const skillsFromTraining = completedTrainingVideos.reduce((allSkills: string[], video) => {
    return [...allSkills, ...video.skillsGained];
  }, []);

  // Remove duplicates and capitalize
  const uniqueTrainingSkills = [...new Set(skillsFromTraining)].map(skill => 
    skill.charAt(0).toUpperCase() + skill.slice(1)
  );

  // Calculate achievements based on real data
  const achievements = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Completed your first training video',
      icon: '🎓',
      earned: completedVideos.length >= 1,
      date: completedVideos.length >= 1 ? new Date().toISOString() : null
    },
    {
      id: '2',
      title: 'Job Seeker',
      description: 'Applied to your first job',
      icon: '💼',
      earned: appliedJobs.length >= 1,
      date: appliedJobs.length >= 1 ? new Date().toISOString() : null
    },
    {
      id: '3',
      title: 'Fast Learner',
      description: 'Completed 5+ training videos',
      icon: '🚀',
      earned: completedVideos.length >= 5,
      date: completedVideos.length >= 5 ? new Date().toISOString() : null
    },
    {
      id: '4',
      title: 'Skill Builder',
      description: 'Gained 10+ new skills',
      icon: '🛠️',
      earned: uniqueTrainingSkills.length + selectedSelfTaughtSkills.length >= 10,
      date: uniqueTrainingSkills.length + selectedSelfTaughtSkills.length >= 10 ? new Date().toISOString() : null
    },
    {
      id: '5',
      title: 'Dedicated Learner',
      description: 'Complete all training videos',
      icon: '⭐',
      earned: completedVideos.length >= 8, // Total of 8 videos available
      date: completedVideos.length >= 8 ? new Date().toISOString() : null
    },
    {
      id: '6',
      title: 'Active Applicant',
      description: 'Applied to 5+ jobs',
      icon: '📋',
      earned: appliedJobs.length >= 5,
      date: appliedJobs.length >= 5 ? new Date().toISOString() : null
    }
  ];

  // Handle saving profile changes
  const handleSaveProfile = () => {
    // In a real app, this would save to a database
    console.log('Profile saved:', editedProfile);
    setIsEditing(false);
  };

  // Handle adding/removing predefined self-taught skills
  const toggleSelfTaughtSkill = (skill: string) => {
    setSelectedSelfTaughtSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  // Handle adding custom self-taught skill
  const addCustomSkill = () => {
    const trimmedSkill = customSkillInput.trim();
    if (trimmedSkill && !selectedSelfTaughtSkills.includes(trimmedSkill)) {
      setSelectedSelfTaughtSkills(prev => [...prev, trimmedSkill]);
      setCustomSkillInput("");
    } else if (selectedSelfTaughtSkills.includes(trimmedSkill)) {
      Alert.alert("Skill already added", "This skill is already in your list.");
    }
  };

  // Handle removing custom skill
  const removeCustomSkill = (skill: string) => {
    setSelectedSelfTaughtSkills(prev => prev.filter(s => s !== skill));
  };

  // Handle adding/removing preferred languages
  const toggleLanguage = (language: string) => {
    setEditedProfile(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.includes(language)
        ? prev.preferredLanguages.filter(lang => lang !== language)
        : [...prev.preferredLanguages, language]
    }));
  };

  // Handle adding custom language
  const addCustomLanguage = () => {
    const trimmedLanguage = customLanguageInput.trim();
    if (trimmedLanguage && !editedProfile.preferredLanguages.includes(trimmedLanguage)) {
      setEditedProfile(prev => ({
        ...prev,
        preferredLanguages: [...prev.preferredLanguages, trimmedLanguage]
      }));
      setCustomLanguageInput("");
    } else if (editedProfile.preferredLanguages.includes(trimmedLanguage)) {
      Alert.alert("Language already added", "This language is already in your list.");
    }
  };

  // Handle removing language
  const removeLanguage = (language: string) => {
    setEditedProfile(prev => ({
      ...prev,
      preferredLanguages: prev.preferredLanguages.filter(lang => lang !== language)
    }));
  };

  return (
    <View style={styles.container}>
      {/* Status Section - Small like home page */}
      <View style={styles.statusSection}>
        <View style={styles.statusContent}>
          <View style={styles.statusText}>
            <Text style={styles.subtitle}>Your professional resume</Text>
            <Text style={styles.stats}>
              {uniqueTrainingSkills.length + selectedSelfTaughtSkills.length} skills • {completedVideos.length} training completed
              {user && ` • ${user.type.charAt(0).toUpperCase() + user.type.slice(1)} Account`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Text style={styles.editButtonText}>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Large scrollable content area like home page */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Picture & Basic Info */}
        <View style={styles.profileSection}>
          <View style={styles.profilePictureContainer}>
            <View style={styles.profilePicturePlaceholder}>
              <Text style={styles.profilePictureText}>
                {editedProfile.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.changePictureButton}>
                <Text style={styles.changePictureText}>Change Photo</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.basicInfo}>
            {isEditing ? (
              <TextInput
                style={styles.nameInput}
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile(prev => ({ ...prev, name: text }))}
                placeholder="Full Name"
              />
            ) : (
              <Text style={styles.name}>{editedProfile.name}</Text>
            )}
            <Text style={styles.bio}>{editedProfile.bio}</Text>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Contact Information</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Email:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.contactInput}
                  value={editedProfile.email}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, email: text }))}
                  placeholder="Email address"
                />
              ) : (
                <Text style={styles.contactValue}>{editedProfile.email}</Text>
              )}
            </View>

            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Phone:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.contactInput}
                  value={editedProfile.phone}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, phone: text }))}
                  placeholder="Phone number"
                />
              ) : (
                <Text style={styles.contactValue}>{editedProfile.phone}</Text>
              )}
            </View>

            <View style={styles.contactItem}>
              <Text style={styles.contactLabel}>Address:</Text>
              {isEditing ? (
                <TextInput
                  style={styles.contactInput}
                  value={editedProfile.address}
                  onChangeText={(text) => setEditedProfile(prev => ({ ...prev, address: text }))}
                  placeholder="Full address"
                  multiline
                />
              ) : (
                <Text style={styles.contactValue}>{editedProfile.address}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Preferred Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Preferred Languages ({editedProfile.preferredLanguages.length})</Text>
          <Text style={styles.sectionSubtitle}>
            Languages you can speak or would like to work in
          </Text>
          
          {isEditing ? (
            <View>
              {/* Selected Languages */}
              <View style={styles.selectedLanguagesContainer}>
                {editedProfile.preferredLanguages.map((language, index) => (
                  <View key={index} style={styles.selectedLanguageTag}>
                    <Text style={styles.selectedLanguageText}>{language}</Text>
                    <TouchableOpacity
                      style={styles.removeLanguageButton}
                      onPress={() => removeLanguage(language)}
                    >
                      <Text style={styles.removeLanguageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Predefined Language Options */}
              <Text style={styles.subSectionTitle}>Choose from common languages:</Text>
              <View style={styles.languageOptions}>
                {PREDEFINED_LANGUAGES.map((language) => (
                  <TouchableOpacity
                    key={language}
                    style={[
                      styles.languageOption,
                      editedProfile.preferredLanguages.includes(language) && styles.selectedLanguageOption
                    ]}
                    onPress={() => toggleLanguage(language)}
                  >
                    <Text style={[
                      styles.languageText,
                      editedProfile.preferredLanguages.includes(language) && styles.selectedLanguageOptionText
                    ]}>
                      {language}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Language Input */}
              <Text style={styles.subSectionTitle}>Or add your own language:</Text>
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  value={customLanguageInput}
                  onChangeText={setCustomLanguageInput}
                  placeholder="Enter language name"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addCustomLanguage}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.languageDisplayContainer}>
              {editedProfile.preferredLanguages.map((language, index) => (
                <View key={index} style={styles.languageDisplayTag}>
                  <Text style={styles.languageDisplayText}>{language}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Skills from Training */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎓 Skills from Training ({uniqueTrainingSkills.length})</Text>
          <Text style={styles.sectionSubtitle}>
            Skills you've gained from completing training videos
          </Text>
          {uniqueTrainingSkills.length > 0 ? (
            <View style={styles.skillsContainer}>
              {uniqueTrainingSkills.map((skill, index) => (
                <View key={index} style={styles.trainingSkillTag}>
                  <Text style={styles.trainingSkillText}>{skill}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noSkillsText}>
              No training skills yet. Go to the Training tab and complete videos to gain new skills!
            </Text>
          )}
        </View>

        {/* Self-Taught Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛠️ Self-Taught Skills ({selectedSelfTaughtSkills.length})</Text>
          <Text style={styles.sectionSubtitle}>
            Skills you've learned on your own
          </Text>
          
          {isEditing ? (
            <View>
              {/* Selected Skills Display */}
              <View style={styles.selectedSkillsContainer}>
                {selectedSelfTaughtSkills.map((skill, index) => (
                  <View key={index} style={styles.selectedSkillTag}>
                    <Text style={styles.selectedSkillText}>{skill}</Text>
                    <TouchableOpacity
                      style={styles.removeSkillButton}
                      onPress={() => removeCustomSkill(skill)}
                    >
                      <Text style={styles.removeSkillText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Predefined Skills */}
              <Text style={styles.subSectionTitle}>Choose from common skills:</Text>
              <View style={styles.skillsContainer}>
                {PREDEFINED_SELF_TAUGHT_SKILLS.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={[
                      styles.selfTaughtSkillTag,
                      selectedSelfTaughtSkills.includes(skill) && styles.selectedSkillOption
                    ]}
                    onPress={() => toggleSelfTaughtSkill(skill)}
                  >
                    <Text style={[
                      styles.selfTaughtSkillText,
                      selectedSelfTaughtSkills.includes(skill) && styles.selectedSkillOptionText
                    ]}>
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Skill Input */}
              <Text style={styles.subSectionTitle}>Or add your own skill:</Text>
              <View style={styles.customInputContainer}>
                <TextInput
                  style={styles.customInput}
                  value={customSkillInput}
                  onChangeText={setCustomSkillInput}
                  placeholder="Enter skill name"
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={addCustomSkill}
                >
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.skillsContainer}>
              {selectedSelfTaughtSkills.length > 0 ? (
                selectedSelfTaughtSkills.map((skill, index) => (
                  <View key={index} style={styles.selectedSkillTag}>
                    <Text style={styles.selectedSkillText}>{skill}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noSkillsText}>
                  No self-taught skills added yet. Tap "Edit Profile" to add your skills!
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Achievements</Text>
          <Text style={styles.sectionSubtitle}>
            Milestones you've reached on your journey
          </Text>
          <View style={styles.achievementsContainer}>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  !achievement.earned && styles.lockedAchievement
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={[
                    styles.achievementTitle,
                    !achievement.earned && styles.lockedText
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementDescription,
                    !achievement.earned && styles.lockedText
                  ]}>
                    {achievement.description}
                  </Text>
                  {achievement.earned && achievement.date && (
                    <Text style={styles.achievementDate}>
                      Earned: {new Date(achievement.date).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                {achievement.earned && (
                  <View style={styles.earnedBadge}>
                    <Text style={styles.earnedText}>✓</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Save Button */}
        {isEditing && (
          <View style={styles.saveSection}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Text style={styles.saveButtonText}>Save Profile</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Stats Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Your Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{savedJobs.length}</Text>
              <Text style={styles.statLabel}>Saved Jobs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{savedVideos.length}</Text>
              <Text style={styles.statLabel}>Saved Videos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedVideos.length}</Text>
              <Text style={styles.statLabel}>Completed Training</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{uniqueTrainingSkills.length + selectedSelfTaughtSkills.length}</Text>
              <Text style={styles.statLabel}>Total Skills</Text>
            </View>
          </View>
        </View>

        {/* Progress Encouragement */}
        {completedVideos.length === 0 && appliedJobs.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚀 Get Started</Text>
            <Text style={styles.encouragementText}>
              Welcome to Rise Up! Start your journey by:
            </Text>
            <Text style={styles.encouragementStep}>
              1. 📚 Complete training videos to gain new skills
            </Text>
            <Text style={styles.encouragementStep}>
              2. 💼 Apply to jobs that match your interests
            </Text>
            <Text style={styles.encouragementStep}>
              3. ⭐ Save jobs and videos for easy access
            </Text>
            <Text style={styles.encouragementText}>
              Your achievements and skills will appear here as you progress!
            </Text>
          </View>
        )}
      </ScrollView>
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
  statusContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusText: {
    flex: 1,
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
  editButton: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePicturePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#5856D6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  profilePictureText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  changePictureButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  changePictureText: {
    fontSize: 12,
    color: '#666',
  },
  basicInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  contactInfo: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 80,
  },
  contactValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  contactInput: {
    fontSize: 16,
    color: '#666',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
  },
  selectedLanguagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectedLanguageTag: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedLanguageText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    marginRight: 6,
  },
  removeLanguageButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeLanguageText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  languageOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedLanguageOption: {
    backgroundColor: '#5856D6',
    borderColor: '#5856D6',
  },
  languageText: {
    fontSize: 14,
    color: '#666',
  },
  selectedLanguageOptionText: {
    color: 'white',
  },
  languageDisplayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageDisplayTag: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  languageDisplayText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  selectedSkillTag: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedSkillText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    marginRight: 6,
  },
  removeSkillButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeSkillText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  trainingSkillTag: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trainingSkillText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  selfTaughtSkillTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedSkillOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  selfTaughtSkillText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedSkillOptionText: {
    color: 'white',
  },
  noSkillsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  achievementsContainer: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 12,
    color: '#999',
  },
  lockedText: {
    color: '#999',
  },
  earnedBadge: {
    backgroundColor: '#34C759',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  saveSection: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: '#5856D6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5856D6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  encouragementText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 22,
  },
  encouragementStep: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
    paddingLeft: 10,
  },
}); 