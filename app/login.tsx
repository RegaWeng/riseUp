import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from './context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        // Small delay to ensure user context is updated
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 100);
      } else {
        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Network error. Please check your connection.');
    }
  };

  const handleDevLogin = async (userType: 'user' | 'employer' | 'admin') => {
    const devCredentials = {
      user: { email: 'alibaba@example.com', password: 'alibaba123' },
      employer: { email: 'yourboss@company.com', password: 'yourboss123' },
      admin: { email: 'admin@riseup.com', password: 'admin123' },
    };

    const { email: devEmail, password: devPassword } = devCredentials[userType];
    
    try {
      const success = await login(devEmail, devPassword);
      if (success) {
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 100);
      } else {
        Alert.alert('Dev Login Failed', 'Dev accounts not set up yet.');
      }
    } catch (error) {
      Alert.alert('Dev Login Failed', 'Network error. Please check your connection.');
    }
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



           {/* Login Button */}
           <TouchableOpacity
             style={[
               styles.loginButton,
               { backgroundColor: '#007AFF' },
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

                     {/* Register Button */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerButtonText}>Create New Account</Text>
          </TouchableOpacity>

          {/* Dev Login Buttons */}
          <View style={styles.devSection}>
            <Text style={styles.devTitle}>Quick Dev Login:</Text>
            <View style={styles.devButtonsRow}>
              <TouchableOpacity
                style={styles.devButton}
                onPress={() => handleDevLogin('user')}
              >
                <Text style={styles.devButtonText}>User</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.devButton}
                onPress={() => handleDevLogin('employer')}
              >
                <Text style={styles.devButtonText}>Employer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.devButton}
                onPress={() => handleDevLogin('admin')}
              >
                <Text style={styles.devButtonText}>Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
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
   registerButton: {
     backgroundColor: 'transparent',
     padding: 16,
     borderRadius: 12,
     alignItems: 'center',
     marginBottom: 20,
     borderWidth: 2,
     borderColor: '#007AFF',
   },
     registerButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  devSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  devTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  devButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  devButton: {
    flex: 1,
    backgroundColor: '#666',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  devButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
