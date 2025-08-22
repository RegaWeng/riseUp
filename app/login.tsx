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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<UserType>('user');
  const { login, isLoading } = useAuth();

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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const success = await login(email, password, selectedUserType);
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    }
  };

  const getSampleCredentials = () => {
    switch (selectedUserType) {
      case 'employer':
        return { email: 'employer@company.com', password: 'employer123' };
      case 'user':
        return { email: 'user@example.com', password: 'user123' };
    }
  };

  const fillSampleCredentials = () => {
    const credentials = getSampleCredentials();
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Rise Up</Text>
          <Text style={styles.subtitle}>Your journey to better opportunities starts here</Text>
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

        {/* Login Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Sign In</Text>
          
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
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

                     {/* Sample Credentials Button */}
           <TouchableOpacity style={styles.sampleButton} onPress={fillSampleCredentials}>
             <Text style={styles.sampleButtonText}>Fill Sample Credentials</Text>
           </TouchableOpacity>

           {/* Admin Login Note */}
           <View style={styles.adminNote}>
             <Text style={styles.adminNoteText}>
               💡 Admin accounts are created through backend only for security.
             </Text>
           </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: userTypes.find(t => t.type === selectedUserType)?.color },
              isLoading && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Don't have an account? Contact support to get started.
          </Text>
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
  sampleButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  sampleButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
     footerText: {
     fontSize: 14,
     color: '#666',
     textAlign: 'center',
     lineHeight: 20,
   },
   adminNote: {
     backgroundColor: '#f0f8ff',
     padding: 12,
     borderRadius: 8,
     marginBottom: 20,
     borderLeftWidth: 4,
     borderLeftColor: '#007AFF',
   },
   adminNoteText: {
     fontSize: 12,
     color: '#007AFF',
     textAlign: 'center',
     lineHeight: 16,
   },
});
