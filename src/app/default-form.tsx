import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

export default function DefaultFormScreen() {
  // Mode: 'login' or 'signup'
  const [formMode, setFormMode] = useState<'login' | 'signup'>('signup');

  // --- LOGIN FIELDS ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- CAKE IMAGE OPTIONS ---
  const cakeOptions = [
    {
      id: '1',
      name: 'Belgian Chocolate Cake',
      flavor: 'Chocolate',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80',
    },
    {
      id: '2',
      name: 'Strawberry Vanilla Cake',
      flavor: 'Strawberry Vanilla',
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80',
    },
    {
      id: '3',
      name: 'Red Velvet Cake',
      flavor: 'Red Velvet',
      image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=500&q=80',
    },
  ];

  const [selectedCake, setSelectedCake] = useState(cakeOptions[0]);

  // --- MODAL STATE ---
  const [isModalVisible, setIsModalVisible] = useState(false);

  // --- SIGNUP / ORDER FIELDS ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [subscribe, setSubscribe] = useState(true);
  const [notes, setNotes] = useState('');

  // --- LOADING INDICATOR & CONSOLE DATA ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null);

  // Submit Handler for Login
  const handleLoginSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const payload = {
        form: 'default_login',
        email: loginEmail,
        passwordLength: loginPassword.length,
        submittedAt: new Date().toISOString(),
      };

      console.log('=== DEFAULT FORM SUBMISSION: LOGIN (JSON) ===');
      console.log(JSON.stringify(payload, null, 2));

      setSubmittedData(payload);
      setIsSubmitting(false);
      Alert.alert('Login Submitted', JSON.stringify(payload, null, 2));
    }, 400);
  };

  // Submit Handler for Sign Up
  const handleSignUpSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const payload = {
        form: 'default_signup_cake_order',
        fullName: name,
        email: email,
        phone: phone,
        passwordLength: password.length,
        selectedCake: {
          name: selectedCake.name,
          flavor: selectedCake.flavor,
          imageUrl: selectedCake.image,
        },
        quantity: Number(quantity) || 1,
        subscribeToNewsletter: subscribe,
        deliveryNotes: notes,
        submittedAt: new Date().toISOString(),
      };

      console.log('=== DEFAULT FORM SUBMISSION: SIGN UP (JSON) ===');
      console.log(JSON.stringify(payload, null, 2));

      setSubmittedData(payload);
      setIsSubmitting(false);
      Alert.alert('Sign Up Submitted', JSON.stringify(payload, null, 2));
    }, 400);
  };

  const handleReset = () => {
    setLoginEmail('');
    setLoginPassword('');
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setSelectedCake(cakeOptions[0]);
    setQuantity('1');
    setSubscribe(true);
    setNotes('');
    setSubmittedData(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Simple Header */}
        <Text style={styles.heading}>Default Form (React Native Core Components)</Text>
        <Text style={styles.subheading}>
          Demonstrating: View, Text, TextInput, Image, Modal, Switch, ActivityIndicator, and Button.
        </Text>

        <View style={styles.divider} />

        {/* Tab switch using native Button */}
        <View style={styles.buttonRow}>
          <Button
            title={formMode === 'login' ? '• Sign In Form (Active)' : 'Sign In Form'}
            onPress={() => setFormMode('login')}
          />
          <View style={styles.gap} />
          <Button
            title={formMode === 'signup' ? '• Sign Up Form (Active)' : 'Sign Up Form'}
            onPress={() => setFormMode('signup')}
          />
        </View>

        <View style={styles.divider} />

        {/* ---------------- LOGIN FORM ---------------- */}
        {formMode === 'login' ? (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Sign In</Text>

            <Text style={styles.label}>Email Address:</Text>
            <TextInput
              style={styles.defaultInput}
              placeholder="Enter email"
              value={loginEmail}
              onChangeText={setLoginEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.defaultInput}
              placeholder="Enter password"
              value={loginPassword}
              onChangeText={setLoginPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />

            {isSubmitting ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color="#0066cc" />
                <Text style={styles.loadingText}>Processing...</Text>
              </View>
            ) : (
              <View style={styles.buttonMargin}>
                <Button title="Sign In & Send JSON to Console" onPress={handleLoginSubmit} />
              </View>
            )}

            <View style={styles.buttonMargin}>
              <Button title="Reset Form" color="#666666" onPress={handleReset} />
            </View>
          </View>
        ) : (
          /* ---------------- SIGN UP / CAKE ORDER FORM ---------------- */
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Sign Up & Cake Order</Text>

            <Text style={styles.label}>Full Name:</Text>
            <TextInput
              style={styles.defaultInput}
              placeholder="Enter full name"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Email Address:</Text>
            <TextInput
              style={styles.defaultInput}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.defaultInput}
              placeholder="Enter phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <Text style={styles.label}>Password:</Text>
            <TextInput
              style={styles.defaultInput}
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />

            {/* --- VIEW WITH IMAGE & MODAL INTEGRATION --- */}
            <Text style={styles.label}>Select Cake (View with Image):</Text>
            <View style={styles.imageSelectorRow}>
              {cakeOptions.map((item) => (
                <View key={item.id} style={styles.imageCard}>
                  <Image source={{ uri: item.image }} style={styles.thumbnailImage} />
                  <Text style={styles.cakeItemName}>{item.name}</Text>
                  <Button
                    title={selectedCake.id === item.id ? '✓ Selected' : 'Select'}
                    onPress={() => setSelectedCake(item)}
                    color={selectedCake.id === item.id ? '#008800' : '#0066cc'}
                  />
                </View>
              ))}
            </View>

            {/* Currently Selected Cake Preview + Modal Button */}
            <View style={styles.selectedPreviewBox}>
              <Text style={styles.selectedLabel}>Current Selection:</Text>
              <Text style={styles.selectedName}>{selectedCake.name}</Text>
              <Image source={{ uri: selectedCake.image }} style={styles.previewImage} />

              {/* Button to open Modal */}
              <View style={styles.buttonMargin}>
                <Button
                  title="Open Cake Image in Modal"
                  color="#225588"
                  onPress={() => setIsModalVisible(true)}
                />
              </View>
            </View>

            <Text style={styles.label}>Quantity:</Text>
            <TextInput
              style={styles.defaultInput}
              placeholder="1"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            <View style={styles.switchRow}>
              <Text style={styles.label}>Subscribe to updates (Switch):</Text>
              <Switch value={subscribe} onValueChange={setSubscribe} />
            </View>

            <Text style={styles.label}>Delivery Instructions (Multiline TextInput):</Text>
            <TextInput
              style={[styles.defaultInput, styles.multiline]}
              placeholder="Enter any special requests..."
              value={notes}
              onChangeText={setNotes}
              multiline={true}
              numberOfLines={3}
            />

            {isSubmitting ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color="#0066cc" />
                <Text style={styles.loadingText}>Submitting form to console...</Text>
              </View>
            ) : (
              <View style={styles.buttonMargin}>
                <Button
                  title="Create Account & Send JSON to Console"
                  onPress={handleSignUpSubmit}
                />
              </View>
            )}

            <View style={styles.buttonMargin}>
              <Button title="Reset Form" color="#666666" onPress={handleReset} />
            </View>
          </View>
        )}

        {/* ---------------- JSON OUTPUT DISPLAY ---------------- */}
        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>Console Output (Raw JSON Payload):</Text>
        {submittedData ? (
          <View style={styles.rawJsonBox}>
            <Text style={styles.rawJsonText}>
              {JSON.stringify(submittedData, null, 2)}
            </Text>
          </View>
        ) : (
          <Text style={styles.emptyText}>
            No form submitted yet. Fill out the fields above and press the submit button to view the JSON output.
          </Text>
        )}

        {/* ============================================================== */}
        {/* SIMPLE IMAGE MODAL (REACT NATIVE <Modal />)                    */}
        {/* ============================================================== */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cake Image Modal</Text>
              <Text style={styles.modalSubtitle}>{selectedCake.name}</Text>

              {/* Large Image inside Modal */}
              <Image source={{ uri: selectedCake.image }} style={styles.modalImage} />

              <Text style={styles.modalFlavorText}>Flavor: {selectedCake.flavor}</Text>

              <View style={styles.modalButtonBox}>
                <Button title="Close Modal" color="#cc3333" onPress={() => setIsModalVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// Simple styles (only basic borders, dimensions, and padding)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    padding: 16,
    maxWidth: 640,
    alignSelf: 'center',
    width: '100%',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: '#555555',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#cccccc',
    marginVertical: 14,
  },
  buttonRow: {
    flexDirection: 'row',
  },
  gap: {
    width: 10,
  },
  formContainer: {
    gap: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  defaultInput: {
    borderWidth: 1,
    borderColor: '#888888',
    padding: 8,
    fontSize: 14,
    borderRadius: 4,
  },
  multiline: {
    height: 70,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  buttonMargin: {
    marginTop: 8,
  },
  imageSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  imageCard: {
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 8,
    borderRadius: 6,
    width: 140,
    alignItems: 'center',
  },
  thumbnailImage: {
    width: 120,
    height: 80,
    borderRadius: 4,
    marginBottom: 4,
  },
  cakeItemName: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  selectedPreviewBox: {
    borderWidth: 1,
    borderColor: '#999999',
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 8,
  },
  selectedLabel: {
    fontSize: 12,
    color: '#666666',
  },
  selectedName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewImage: {
    width: 200,
    height: 130,
    borderRadius: 6,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 10,
  },
  loadingText: {
    fontSize: 13,
    color: '#0066cc',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  rawJsonBox: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 12,
    borderRadius: 4,
  },
  rawJsonText: {
    fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }),
    fontSize: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#777777',
    fontStyle: 'italic',
  },

  // Simple Modal Overlay Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    maxWidth: 360,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 12,
  },
  modalImage: {
    width: 280,
    height: 200,
    borderRadius: 6,
  },
  modalFlavorText: {
    fontSize: 13,
    color: '#333333',
    marginVertical: 10,
    fontStyle: 'italic',
  },
  modalButtonBox: {
    width: '100%',
    marginTop: 6,
  },
});
