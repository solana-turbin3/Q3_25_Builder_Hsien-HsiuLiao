import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import COLORS from '@/assets/colors';
import TYPOGRAPHY from '@/assets/typography';

interface FormData {
  venueName: string;
  decibelLevel: string;
  timestamp: string;
  notes: string;
}

export default function LoudnessAppScreen() {
  const [formData, setFormData] = useState<FormData>({
    venueName: '',
    decibelLevel: '',
    timestamp: '',
    notes: '',
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // Validate form
    if (!formData.venueName.trim() || !formData.decibelLevel.trim()) {
      Alert.alert('Validation Error', 'Please fill in venue name and decibel level');
      return;
    }

    // Here you would typically submit to your Solana program
    console.log('Form submitted:', formData);
    Alert.alert(
      'Success!',
      'Your loudness data has been submitted to the blockchain!',
      [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setFormData({
              venueName: '',
              decibelLevel: '',
              timestamp: '',
              notes: '',
            });
          },
        },
      ]
    );
  };

  const setCurrentTimestamp = () => {
    const now = new Date();
    const timestamp = now.toISOString();
    handleInputChange('timestamp', timestamp);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>🎵 Loudness App</Text>
          <Text style={styles.subtitle}>
            Submit sound level data to the blockchain
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Venue Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.venueName}
              onChangeText={(value) => handleInputChange('venueName', value)}
              placeholder="Enter venue name"
              placeholderTextColor={COLORS.textLight}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Decibel Level *</Text>
            <TextInput
              style={styles.input}
              value={formData.decibelLevel}
              onChangeText={(value) => handleInputChange('decibelLevel', value)}
              placeholder="Enter decibel level (e.g., 85)"
              placeholderTextColor={COLORS.textLight}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Timestamp</Text>
            <View style={styles.timestampContainer}>
              <TextInput
                style={[styles.input, styles.timestampInput]}
                value={formData.timestamp}
                onChangeText={(value) => handleInputChange('timestamp', value)}
                placeholder="Auto-generated timestamp"
                placeholderTextColor={COLORS.textLight}
                editable={false}
              />
              <TouchableOpacity
                style={styles.timestampButton}
                onPress={setCurrentTimestamp}
              >
                <Text style={styles.timestampButtonText}>Now</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              placeholder="Any additional notes about the venue or event"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit to Blockchain</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>ℹ️ How it works:</Text>
          <Text style={styles.infoText}>
            • Fill out the form above with venue and sound level data{'\n'}
            • Click submit to send data to the Solana blockchain{'\n'}
            • Your submission will be recorded as an NFT{'\n'}
            • Earn rewards for contributing to the DePIN network
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: TYPOGRAPHY.size.xxxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.lighterBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDarkColor,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    color: COLORS.white,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.darkerBackground,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.borderDarkColor,
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestampInput: {
    flex: 1,
    marginRight: 12,
  },
  timestampButton: {
    backgroundColor: COLORS.brandPrimary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestampButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: COLORS.brandPrimary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.brandPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
  infoContainer: {
    backgroundColor: COLORS.lighterBackground,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderDarkColor,
  },
  infoTitle: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weights.semiBold,
    color: COLORS.white,
    marginBottom: 12,
  },
  infoText: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weights.regular,
    color: COLORS.textLight,
    lineHeight: 22,
  },
}); 