import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth, UserType } from './context/AuthContext';
import { router } from 'expo-router';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<UserType>('user');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();

  const userTypes: { type: UserType; label: string; description: string; color: string }[] = [
    {
      type: 'user',
      label: 'Job Seeker',
      description: 'Find jobs and training opportunities',
      color: '#34C759',
    },
    {
      type: 'employer',
      label: 'Employer',
      description: 'Post jobs and manage applications',
      color: '#007AFF',
    },
  ];

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await register(name, email, password, selectedUserType);
      if (success) {
        Alert.alert(
          'Registration Successful!',
          `Welcome ${name}! Your ${selectedUserType === 'user' ? 'Job Seeker' : 'Employer'} account has been created.`,
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        Alert.alert('Registration Failed', 'Please try again or contact support.');
      }
    } catch (error) {
      Alert.alert('Registration Failed', 'Network error. Please check your connection.');
    }
    
    setIsLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Rise Up and start your journey</Text>
        </View>

        {/* Account Type Selection */}
        <View style={styles.accountTypeSection}>
          <Text style={styles.sectionTitle}>Choose your account type:</Text>
          <View style={styles.accountTypeContainer}>
            {userTypes.map((userType) => (
              <TouchableOpacity
                key={userType.type}
                style={[
                  styles.accountTypeButton,
                  selectedUserType === userType.type && {
                    backgroundColor: userType.color,
                    borderColor: userType.color,
                  },
                ]}
                onPress={() => setSelectedUserType(userType.type)}
              >
                <Text
                  style={[
                    styles.accountTypeLabel,
                    selectedUserType === userType.type && styles.selectedAccountTypeLabel,
                  ]}
                >
                  {userType.label}
                </Text>
                <Text
                  style={[
                    styles.accountTypeDescription,
                    selectedUserType === userType.type && styles.selectedAccountTypeDescription,
                  ]}
                >
                  {userType.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Registration Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Account Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              { backgroundColor: userTypes.find(t => t.type === selectedUserType)?.color },
              isLoading && styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.registerButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backToLoginText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  accountTypeSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  accountTypeContainer: {
    gap: 12,
  },
  accountTypeButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  accountTypeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  accountTypeDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedAccountTypeLabel: {
    color: 'white',
  },
  selectedAccountTypeDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formSection: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  registerButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToLoginButton: {
    alignItems: 'center',
    padding: 10,
  },
  backToLoginText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
});
