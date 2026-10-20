import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import {
  ArtisanSparkle,
  BakeryEmblem,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  CodeIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  PhoneIcon,
  RotateCcwIcon,
  UserIcon,
} from '@/components/cake-shop/icons';

interface ConsoleLogItem {
  id: number;
  timestamp: string;
  type: 'success' | 'error' | 'info';
  title: string;
  data?: Record<string, unknown>;
  message?: string;
}

export default function CakeShopScreen() {
  // Navigation tabs
  const [activeView, setActiveView] = useState<'app' | 'guide'>('app');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [guideStep, setGuideStep] = useState<number>(1);

  // Console Modal state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [copiedLogId, setCopiedLogId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Virtual console logs
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogItem[]>([
    {
      id: 1,
      timestamp: 'Ready',
      type: 'info',
      title: 'Console Initialized',
      message: 'Submit any form to inspect serialized JSON payloads here and in your terminal.',
    },
  ]);

  // Safely update client timestamp after mount to prevent SSR hydration mismatch
  useEffect(() => {
    setConsoleLogs((prev) =>
      prev.map((log) =>
        log.id === 1 ? { ...log, timestamp: new Date().toLocaleTimeString() } : log
      )
    );
  }, []);

  // --- LOGIN FORM STATE ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  // --- SIGN UP FORM STATE ---
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [cakeCategory, setCakeCategory] = useState('Celebration Tiers');
  const [orderingCadence, setOrderingCadence] = useState('Occasional');
  const [dietaryOptions, setDietaryOptions] = useState<string[]>(['Eggless Recipe']);
  const [newsletter, setNewsletter] = useState(true);
  const [specialNotes, setSpecialNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState<Record<string, string>>({});
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  // Bakery Collections
  const cakeCategories = [
    'Celebration Tiers',
    'Artisanal Gateaux',
    'Viennoiserie & Tarts',
    'Vegan & Botanical',
    'Bespoke Wedding Cakes',
  ];

  const dietaryChoices = [
    'Eggless Recipe',
    'Nut-Free Kitchen',
    'Low Cane Sugar',
    'Dairy-Free Oat',
  ];

  // Helper to log to system console and in-app drawer
  const logToConsole = (
    type: 'success' | 'error' | 'info',
    title: string,
    data?: Record<string, unknown>,
    message?: string
  ) => {
    // 1. Real System Terminal / Developer Console output
    console.log(`\n=================== [${type.toUpperCase()}] ${title} ===================`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
    if (message) {
      console.log(`Note: ${message}`);
    }
    console.log('========================================================================\n');

    // 2. In-App Console entry
    const newLog: ConsoleLogItem = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      title,
      data,
      message,
    };
    setConsoleLogs((prev) => [newLog, ...prev]);

    // 3. Unobtrusive floating toast
    setToastMessage(`✓ ${title} · JSON emitted`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const clearConsole = () => {
    setConsoleLogs([]);
  };

  const copyToClipboard = async (text: string, logId: number) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedLogId(logId);
      setTimeout(() => setCopiedLogId(null), 2000);
    } catch {
      Alert.alert('JSON Copied', 'Check system terminal output.');
    }
  };

  // --- LOGIN SUBMIT HANDLER ---
  const handleLoginSubmit = () => {
    const errors: Record<string, string> = {};
    if (!loginEmail.trim()) {
      errors.email = 'Please provide an email or patron ID';
    }
    if (!loginPassword) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      logToConsole('error', 'Authentication Failed', errors);
      return;
    }

    setLoginErrors({});
    const payload = {
      action: 'PATRON_LOGIN',
      credentials: {
        identifier: loginEmail.trim(),
        passwordLength: loginPassword.length,
        rememberDevice: rememberMe,
      },
      client: {
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
      },
    };

    logToConsole('success', 'Sign In Successful', payload);
  };

  const handleClearLogin = () => {
    setLoginEmail('');
    setLoginPassword('');
    setRememberMe(false);
    setLoginErrors({});
  };

  const handleDemoLogin = () => {
    setLoginEmail('amelia.vance@maisoncrumb.com');
    setLoginPassword('Patisserie2026!');
    setRememberMe(true);
    setLoginErrors({});
  };

  // --- SIGN UP SUBMIT HANDLER ---
  const handleSignUpSubmit = () => {
    const errors: Record<string, string> = {};
    if (!signUpName.trim()) {
      errors.name = 'Full name is required';
    }
    if (!signUpEmail.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(signUpEmail.trim())) {
      errors.email = 'Please enter a valid email format';
    }
    if (!signUpPassword) {
      errors.password = 'Password is required';
    } else if (signUpPassword.length < 6) {
      errors.password = 'Must be at least 6 characters';
    }
    if (!agreeTerms) {
      errors.terms = 'Please accept the atelier policies';
    }

    if (Object.keys(errors).length > 0) {
      setSignUpErrors(errors);
      logToConsole('error', 'Registration Validation Failed', errors);
      return;
    }

    setSignUpErrors({});
    const payload = {
      action: 'PATRON_REGISTRATION',
      profile: {
        fullName: signUpName.trim(),
        email: signUpEmail.trim().toLowerCase(),
        phone: signUpPhone.trim() || 'Unspecified',
      },
      preferences: {
        collection: cakeCategory,
        cadence: orderingCadence,
        dietary: dietaryOptions,
        clubMembership: newsletter,
        patronNotes: specialNotes.trim() || 'None',
      },
      policyAgreed: agreeTerms,
      submittedAt: new Date().toISOString(),
    };

    logToConsole('success', 'Account Registered', payload);
  };

  const handleClearSignUp = () => {
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPhone('');
    setSignUpPassword('');
    setCakeCategory('Celebration Tiers');
    setOrderingCadence('Occasional');
    setDietaryOptions(['Eggless Recipe']);
    setNewsletter(true);
    setSpecialNotes('');
    setAgreeTerms(false);
    setSignUpErrors({});
  };

  const handleDemoSignUp = () => {
    setSignUpName('Camille Laurent');
    setSignUpEmail('camille.laurent@parisien.org');
    setSignUpPhone('+1 (555) 342-9810');
    setSignUpPassword('VanillaFleur$26');
    setCakeCategory('Artisanal Gateaux');
    setOrderingCadence('Special Event');
    setDietaryOptions(['Eggless Recipe', 'Nut-Free Kitchen']);
    setNewsletter(true);
    setSpecialNotes('Double-tiered naked sponge with caramelized figs and elderflower glaze. Please deliver at 1 PM.');
    setAgreeTerms(true);
    setSignUpErrors({});
  };

  const toggleDietaryOption = (opt: string) => {
    setDietaryOptions((prev) =>
      prev.includes(opt) ? prev.filter((item) => item !== opt) : [...prev, opt]
    );
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: '', color: '#E5DED6', width: '0%' };
    if (pass.length < 6) return { label: 'Short', color: '#B45339', width: '25%' };
    if (pass.length < 9) return { label: 'Medium', color: '#C88A58', width: '60%' };
    return { label: 'Strong', color: '#4A6B53', width: '100%' };
  };

  const passStrength = getPasswordStrength(signUpPassword);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        {/* --- REFINED PATISSERIE TOP BAR --- */}
        <View style={styles.topBar}>
          <View style={styles.topBarContent}>
            <View style={styles.brandRow}>
              <BakeryEmblem size={34} />
              <View>
                <Text style={styles.brandTitle}>Maison Crumb</Text>
                <Text style={styles.brandSubtitle}>Pâtisserie & Atelier</Text>
              </View>
            </View>

            {/* Actions: Console Drawer Button */}
            <View style={styles.navActionsRow}>
              {/* CONSOLE DRAWER TRIGGER BUTTON */}
              <TouchableOpacity
                onPress={() => setIsConsoleOpen(true)}
                style={styles.consoleTriggerBtn}
                activeOpacity={0.8}
              >
                <CodeIcon size={14} color="#A85A3C" />
                <Text style={styles.consoleTriggerText}>
                  Console ({consoleLogs.length})
                </Text>
                <View style={styles.statusDot} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* --- FLOATING TOAST BANNER --- */}
        {toastMessage && (
          <View style={styles.toastContainer}>
            <Text style={styles.toastText}>{toastMessage}</Text>
            <TouchableOpacity
              onPress={() => setIsConsoleOpen(true)}
              style={styles.toastActionBtn}
            >
              <Text style={styles.toastActionText}>View JSON</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- MAIN CONTENT AREA --- */}
        {activeView === 'app' ? (
          <ScrollView
            style={styles.mainScroll}
            contentContainerStyle={styles.centeredScrollContent}
          >
            {/* ELEGANT CENTERED BAKERY CARD */}
            <View style={styles.bakeryCard}>
              {/* Bakery Card Header Banner */}
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderTitle}>Artisanal Patrons</Text>
                <Text style={styles.cardHeaderSubtitle}>
                  Bespoke cake commissions, private tastings & seasonal orders
                </Text>

                {/* Refined Pill Auth Switcher */}
                <View style={styles.authSwitchContainer}>
                  <TouchableOpacity
                    onPress={() => setAuthMode('login')}
                    style={[
                      styles.authSwitchBtn,
                      authMode === 'login' && styles.authSwitchBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.authSwitchText,
                        authMode === 'login' && styles.authSwitchTextActive,
                      ]}
                    >
                      Sign In
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setAuthMode('signup')}
                    style={[
                      styles.authSwitchBtn,
                      authMode === 'signup' && styles.authSwitchBtnActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.authSwitchText,
                        authMode === 'signup' && styles.authSwitchTextActive,
                      ]}
                    >
                      Create Account
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* CARD FORM BODY */}
              <View style={styles.formBody}>
                {/* ============================================================== */}
                {/* 1. SIGN IN (LOGIN) FORM                                        */}
                {/* ============================================================== */}
                {authMode === 'login' && (
                  <View style={styles.formStack}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionTitle}>Welcome Back</Text>
                      <TouchableOpacity onPress={handleDemoLogin}>
                        <Text style={styles.demoLink}>Autofill Demo</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Email Input */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Patron Email</Text>
                      <View
                        style={[
                          styles.inputRow,
                          loginErrors.email ? styles.inputRowError : null,
                        ]}
                      >
                        <MailIcon size={15} color="#8D7B73" />
                        <TextInput
                          style={styles.textInput}
                          placeholder="amelia.vance@maisoncrumb.com"
                          placeholderTextColor="#B9AEA6"
                          value={loginEmail}
                          onChangeText={setLoginEmail}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="email-address"
                        />
                      </View>
                      {loginErrors.email && (
                        <Text style={styles.errorLabel}>{loginErrors.email}</Text>
                      )}
                    </View>

                    {/* Password Input */}
                    <View style={styles.fieldGroup}>
                      <View style={styles.labelRow}>
                        <Text style={styles.fieldLabel}>Password</Text>
                        <TouchableOpacity
                          onPress={() =>
                            Alert.alert('Password Recovery', 'Recovery instructions have been dispatched.')
                          }
                        >
                          <Text style={styles.forgotLink}>Forgot?</Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={[
                          styles.inputRow,
                          loginErrors.password ? styles.inputRowError : null,
                        ]}
                      >
                        <LockIcon size={15} color="#8D7B73" />
                        <TextInput
                          style={styles.textInput}
                          placeholder="••••••••"
                          placeholderTextColor="#B9AEA6"
                          value={loginPassword}
                          onChangeText={setLoginPassword}
                          secureTextEntry={!showLoginPassword}
                          autoCapitalize="none"
                        />
                        <TouchableOpacity
                          onPress={() => setShowLoginPassword(!showLoginPassword)}
                          style={styles.visibilityToggle}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          {showLoginPassword ? (
                            <EyeOffIcon size={16} color="#A85A3C" />
                          ) : (
                            <EyeIcon size={16} color="#8D7B73" />
                          )}
                        </TouchableOpacity>
                      </View>
                      {loginErrors.password && (
                        <Text style={styles.errorLabel}>{loginErrors.password}</Text>
                      )}
                    </View>

                    {/* Remember Me Checkbox */}
                    <TouchableOpacity
                      onPress={() => setRememberMe(!rememberMe)}
                      style={styles.checkboxLine}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.checkboxBox,
                          rememberMe && styles.checkboxBoxChecked,
                        ]}
                      >
                        {rememberMe && <CheckIcon size={10} color="#FFFFFF" />}
                      </View>
                      <Text style={styles.checkboxTitle}>
                        Keep me signed in on this device
                      </Text>
                    </TouchableOpacity>

                    {/* Buttons */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        onPress={handleClearLogin}
                        style={styles.secondaryBtn}
                      >
                        <RotateCcwIcon size={13} color="#7D6A62" />
                        <Text style={styles.secondaryBtnText}>Clear</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleLoginSubmit}
                        style={styles.primaryBtn}
                      >
                        <Text style={styles.primaryBtnText}>Sign In</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* ============================================================== */}
                {/* 2. CREATE ACCOUNT (SIGN UP) FORM                               */}
                {/* ============================================================== */}
                {authMode === 'signup' && (
                  <View style={styles.formStack}>
                    <View style={styles.sectionHeaderRow}>
                      <Text style={styles.sectionTitle}>Patron Registration</Text>
                      <TouchableOpacity onPress={handleDemoSignUp}>
                        <Text style={styles.demoLink}>Autofill Demo</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Full Name */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Full Name</Text>
                      <View
                        style={[
                          styles.inputRow,
                          signUpErrors.name ? styles.inputRowError : null,
                        ]}
                      >
                        <UserIcon size={15} color="#8D7B73" />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Camille Laurent"
                          placeholderTextColor="#B9AEA6"
                          value={signUpName}
                          onChangeText={setSignUpName}
                          autoCapitalize="words"
                          autoCorrect={false}
                        />
                      </View>
                      {signUpErrors.name && (
                        <Text style={styles.errorLabel}>{signUpErrors.name}</Text>
                      )}
                    </View>

                    {/* Email */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Email Address</Text>
                      <View
                        style={[
                          styles.inputRow,
                          signUpErrors.email ? styles.inputRowError : null,
                        ]}
                      >
                        <MailIcon size={15} color="#8D7B73" />
                        <TextInput
                          style={styles.textInput}
                          placeholder="camille@atelier.com"
                          placeholderTextColor="#B9AEA6"
                          value={signUpEmail}
                          onChangeText={setSignUpEmail}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="email-address"
                        />
                      </View>
                      {signUpErrors.email && (
                        <Text style={styles.errorLabel}>{signUpErrors.email}</Text>
                      )}
                    </View>

                    {/* Phone (For delivery SMS) */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Delivery Phone Contact</Text>
                      <View style={styles.inputRow}>
                        <PhoneIcon size={15} color="#8D7B73" />
                        <TextInput
                          style={styles.textInput}
                          placeholder="+1 (555) 000-0000"
                          placeholderTextColor="#B9AEA6"
                          value={signUpPhone}
                          onChangeText={setSignUpPhone}
                          keyboardType="phone-pad"
                        />
                      </View>
                    </View>

                    {/* Password */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Create Password</Text>
                      <View
                        style={[
                          styles.inputRow,
                          signUpErrors.password ? styles.inputRowError : null,
                        ]}
                      >
                        <LockIcon size={15} color="#8D7B73" />
                        <TextInput
                          style={styles.textInput}
                          placeholder="Minimum 6 characters"
                          placeholderTextColor="#B9AEA6"
                          value={signUpPassword}
                          onChangeText={setSignUpPassword}
                          secureTextEntry={!showSignUpPassword}
                          autoCapitalize="none"
                        />
                        <TouchableOpacity
                          onPress={() => setShowSignUpPassword(!showSignUpPassword)}
                          style={styles.visibilityToggle}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          {showSignUpPassword ? (
                            <EyeOffIcon size={16} color="#A85A3C" />
                          ) : (
                            <EyeIcon size={16} color="#8D7B73" />
                          )}
                        </TouchableOpacity>
                      </View>

                      {/* Password Strength Line */}
                      {signUpPassword.length > 0 && (
                        <View style={styles.strengthRow}>
                          <View style={styles.strengthTrack}>
                            <View
                              style={[
                                styles.strengthFill,
                                {
                                  width: passStrength.width as any,
                                  backgroundColor: passStrength.color,
                                },
                              ]}
                            />
                          </View>
                          <Text
                            style={[
                              styles.strengthLabel,
                              { color: passStrength.color },
                            ]}
                          >
                            {passStrength.label}
                          </Text>
                        </View>
                      )}
                      {signUpErrors.password && (
                        <Text style={styles.errorLabel}>{signUpErrors.password}</Text>
                      )}
                    </View>

                    {/* Cake Collection Dropdown */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Preferred Patisserie Collection</Text>
                      <TouchableOpacity
                        onPress={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                        style={styles.selectTrigger}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.selectTriggerText}>{cakeCategory}</Text>
                        <ChevronDownIcon size={12} color="#8D7B73" />
                      </TouchableOpacity>

                      {categoryDropdownOpen && (
                        <View style={styles.dropdownSheet}>
                          {cakeCategories.map((cat) => (
                            <TouchableOpacity
                              key={cat}
                              onPress={() => {
                                setCakeCategory(cat);
                                setCategoryDropdownOpen(false);
                              }}
                              style={[
                                styles.dropdownLine,
                                cakeCategory === cat && styles.dropdownLineActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.dropdownLineText,
                                  cakeCategory === cat && styles.dropdownLineTextActive,
                                ]}
                              >
                                {cat}
                              </Text>
                              {cakeCategory === cat && (
                                <CheckIcon size={11} color="#A85A3C" />
                              )}
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Ordering Cadence Chips */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Ordering Cadence</Text>
                      <View style={styles.chipRow}>
                        {['Monthly', 'Occasional', 'Special Event'].map((cad) => (
                          <TouchableOpacity
                            key={cad}
                            onPress={() => setOrderingCadence(cad)}
                            style={[
                              styles.cadenceChip,
                              orderingCadence === cad && styles.cadenceChipActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.cadenceChipText,
                                orderingCadence === cad && styles.cadenceChipTextActive,
                              ]}
                            >
                              {cad}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Dietary Multi-Select Filter Pills */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>Dietary Requirements</Text>
                      <View style={styles.chipRow}>
                        {dietaryChoices.map((diet) => {
                          const isSelected = dietaryOptions.includes(diet);
                          return (
                            <TouchableOpacity
                              key={diet}
                              onPress={() => toggleDietaryOption(diet)}
                              style={[
                                styles.dietaryPill,
                                isSelected && styles.dietaryPillActive,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.dietaryPillText,
                                  isSelected && styles.dietaryPillTextActive,
                                ]}
                              >
                                {isSelected ? '✓ ' : '+ '}
                                {diet}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    {/* Patisserie Newsletter Switch */}
                    <View style={styles.switchBox}>
                      <View style={styles.switchInfo}>
                        <Text style={styles.switchTitle}>Maison Crumb Privilège</Text>
                        <Text style={styles.switchSubtitle}>
                          Invitations to private seasonal tastings & holiday menu previews
                        </Text>
                      </View>
                      <Switch
                        value={newsletter}
                        onValueChange={setNewsletter}
                        trackColor={{ false: '#E2DBD2', true: '#C36B4E' }}
                        thumbColor={newsletter ? '#FFFFFF' : '#F7F3EE'}
                      />
                    </View>

                    {/* Multiline Special Instructions */}
                    <View style={styles.fieldGroup}>
                      <Text style={styles.fieldLabel}>
                        Patron Notes & Flavor Inscriptions
                      </Text>
                      <TextInput
                        style={styles.multilineArea}
                        placeholder="Allergies, flavor preferences, or custom calligraphy requests..."
                        placeholderTextColor="#B9AEA6"
                        value={specialNotes}
                        onChangeText={setSpecialNotes}
                        multiline={true}
                        numberOfLines={3}
                        textAlignVertical="top"
                      />
                    </View>

                    {/* Terms Checkbox */}
                    <View style={styles.fieldGroup}>
                      <TouchableOpacity
                        onPress={() => setAgreeTerms(!agreeTerms)}
                        style={styles.checkboxLine}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.checkboxBox,
                            agreeTerms && styles.checkboxBoxChecked,
                            signUpErrors.terms ? styles.checkboxBoxError : null,
                          ]}
                        >
                          {agreeTerms && <CheckIcon size={10} color="#FFFFFF" />}
                        </View>
                        <Text style={styles.checkboxTitle}>
                          I agree to Maison Crumb atelier & reservation terms
                        </Text>
                      </TouchableOpacity>
                      {signUpErrors.terms && (
                        <Text style={styles.errorLabel}>{signUpErrors.terms}</Text>
                      )}
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsRow}>
                      <TouchableOpacity
                        onPress={handleClearSignUp}
                        style={styles.secondaryBtn}
                      >
                        <RotateCcwIcon size={13} color="#7D6A62" />
                        <Text style={styles.secondaryBtnText}>Reset</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handleSignUpSubmit}
                        style={styles.primaryBtn}
                      >
                        <Text style={styles.primaryBtnText}>Register Patron</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        ) : (
          /* ============================================================== */
          /* 3. FORM ANATOMY & GUIDE TAB                                     */
          /* ============================================================== */
          <ScrollView
            style={styles.mainScroll}
            contentContainerStyle={styles.centeredScrollContent}
          >
            <View style={styles.guideCard}>
              <View style={styles.guideStepRow}>
                {[
                  { id: 1, title: 'Text Inputs' },
                  { id: 2, title: 'Form Controls' },
                  { id: 3, title: 'JSON Payloads' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => setGuideStep(item.id)}
                    style={[
                      styles.guidePill,
                      guideStep === item.id && styles.guidePillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.guidePillText,
                        guideStep === item.id && styles.guidePillTextActive,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {guideStep === 1 && (
                <View style={styles.guideBlock}>
                  <Text style={styles.guideTitle}>React Native TextInput Patterns</Text>
                  <Text style={styles.guideText}>
                    Mobile keyboards must be tailored to the expected data to streamline form completion:
                  </Text>
                  <View style={styles.guideCodeItem}>
                    <Text style={styles.guideCodeName}>Email Input</Text>
                    <Text style={styles.guideCodeDetail}>
                      keyboardType="email-address" · autoCapitalize="none" · autoCorrect=&#123;false&#125;
                    </Text>
                  </View>
                  <View style={styles.guideCodeItem}>
                    <Text style={styles.guideCodeName}>Password Input</Text>
                    <Text style={styles.guideCodeDetail}>
                      secureTextEntry=&#123;!showPassword&#125; paired with custom toggle icon
                    </Text>
                  </View>
                  <View style={styles.guideCodeItem}>
                    <Text style={styles.guideCodeName}>Multiline Text Area</Text>
                    <Text style={styles.guideCodeDetail}>
                      multiline=&#123;true&#125; · numberOfLines=&#123;3&#125; · textAlignVertical="top"
                    </Text>
                  </View>
                </View>
              )}

              {guideStep === 2 && (
                <View style={styles.guideBlock}>
                  <Text style={styles.guideTitle}>Touch-Optimized Form Controls</Text>
                  <Text style={styles.guideText}>
                    Replacing desktop radio buttons with tactile touch targets reduces mobile friction:
                  </Text>
                  <View style={styles.guideCodeItem}>
                    <Text style={styles.guideCodeName}>Native &lt;Switch /&gt;</Text>
                    <Text style={styles.guideCodeDetail}>
                      Configured with brand trackColor & thumbColor for seamless toggling.
                    </Text>
                  </View>
                  <View style={styles.guideCodeItem}>
                    <Text style={styles.guideCodeName}>Choice Chips</Text>
                    <Text style={styles.guideCodeDetail}>
                      Touchable pills that display selected state with high contrast.
                    </Text>
                  </View>
                </View>
              )}

              {guideStep === 3 && (
                <View style={styles.guideBlock}>
                  <Text style={styles.guideTitle}>Packaging & Emitting JSON</Text>
                  <Text style={styles.guideText}>
                    Submissions assemble React state into structured JSON, serialized for network transmission:
                  </Text>
                  <View style={styles.codeSnippet}>
                    <Text style={styles.snippetText}>
                      {`const payload = {\n  profile: { name, email },\n  preferences: { collection, cadence },\n  timestamp: new Date().toISOString()\n};\n\nconsole.log(JSON.stringify(payload, null, 2));`}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        )}

        {/* ============================================================== */}
        {/* DEVELOPER CONSOLE MODAL SHEET                                  */}
        {/* ============================================================== */}
        <Modal
          visible={isConsoleOpen}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setIsConsoleOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.consoleSheet}>
              {/* Sheet Header */}
              <View style={styles.consoleHeader}>
                <View style={styles.consoleTitleGroup}>
                  <CodeIcon size={16} color="#A85A3C" />
                  <Text style={styles.consoleSheetTitle}>Developer Console Stream</Text>
                  <View style={styles.logCountBadge}>
                    <Text style={styles.logCountText}>{consoleLogs.length}</Text>
                  </View>
                </View>

                <View style={styles.consoleHeaderActions}>
                  <TouchableOpacity
                    onPress={clearConsole}
                    style={styles.sheetActionBtn}
                  >
                    <Text style={styles.sheetActionText}>Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsConsoleOpen(false)}
                    style={styles.closeBtn}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <CloseIcon size={14} color="#7D6A62" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sheet Body (JSON Entries) */}
              <ScrollView style={styles.consoleBody}>
                {consoleLogs.length === 0 ? (
                  <View style={styles.emptyLogsView}>
                    <Text style={styles.emptyLogsText}>
                      No form logs recorded yet.{'\n'}Submit either form to inspect the emitted JSON payload.
                    </Text>
                  </View>
                ) : (
                  consoleLogs.map((log) => (
                    <View
                      key={log.id}
                      style={[
                        styles.logEntry,
                        log.type === 'success'
                          ? styles.logEntrySuccess
                          : log.type === 'error'
                          ? styles.logEntryError
                          : styles.logEntryInfo,
                      ]}
                    >
                      <View style={styles.logEntryHeader}>
                        <Text style={styles.logTimestamp}>[{log.timestamp}]</Text>
                        {log.data && (
                          <TouchableOpacity
                            onPress={() =>
                              copyToClipboard(JSON.stringify(log.data, null, 2), log.id)
                            }
                            style={styles.copyBtn}
                          >
                            <CopyIcon size={11} color="#A85A3C" />
                            <Text style={styles.copyBtnText}>
                              {copiedLogId === log.id ? 'Copied' : 'Copy JSON'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>

                      <Text style={styles.logTitle}>{log.title}</Text>
                      {log.message && (
                        <Text style={styles.logMessage}>{log.message}</Text>
                      )}

                      {log.data && (
                        <View style={styles.jsonTerminalBox}>
                          <Text style={styles.jsonTerminalText}>
                            {JSON.stringify(log.data, null, 2)}
                          </Text>
                        </View>
                      )}
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==============================================================
// STYLESHEET — MAISON CRUMB PATISSERIE PALETTE
// ==============================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF6F0',
  },
  keyboardContainer: {
    flex: 1,
  },
  topBar: {
    backgroundColor: '#FAF6F0',
    borderBottomWidth: 1,
    borderBottomColor: '#EBE2D8',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  topBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 960,
    alignSelf: 'center',
    width: '100%',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2C1A14',
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    letterSpacing: 0.3,
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#8D7B73',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  navActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  viewSegment: {
    flexDirection: 'row',
    backgroundColor: '#EFE7DE',
    borderRadius: 8,
    padding: 2.5,
  },
  viewSegmentBtn: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  viewSegmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  viewSegmentText: {
    fontSize: 12,
    color: '#7D6A62',
    fontWeight: '500',
  },
  viewSegmentTextActive: {
    color: '#2C1A14',
    fontWeight: '600',
  },
  consoleTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#DFD3C7',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  consoleTriggerText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A85A3C',
    fontFamily: 'monospace',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4A6B53',
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C1A14',
    paddingHorizontal: 16,
    paddingVertical: 9,
    maxWidth: 480,
    alignSelf: 'center',
    width: '90%',
    borderRadius: 10,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  toastText: {
    fontSize: 12,
    color: '#FAF5EE',
    fontWeight: '500',
  },
  toastActionBtn: {
    backgroundColor: '#A85A3C',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  toastActionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mainScroll: {
    flex: 1,
    backgroundColor: '#FAF6F0',
  },
  centeredScrollContent: {
    padding: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  bakeryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#EAE1D7',
    maxWidth: 500,
    width: '100%',
    shadowColor: '#2C1A14',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: '#FCFAF7',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE4DA',
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  cardHeaderTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: '#2C1A14',
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    letterSpacing: 0.2,
  },
  cardHeaderSubtitle: {
    fontSize: 12,
    color: '#8D7B73',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 17,
    maxWidth: 360,
  },
  authSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFE7DE',
    borderRadius: 10,
    padding: 3,
    marginTop: 18,
    width: '100%',
    maxWidth: 280,
  },
  authSwitchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  authSwitchBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  authSwitchText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7D6A62',
  },
  authSwitchTextActive: {
    fontWeight: '600',
    color: '#2C1A14',
  },
  formBody: {
    padding: 24,
  },
  formStack: {
    gap: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C1A14',
    letterSpacing: 0.2,
  },
  demoLink: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A85A3C',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EFE3D6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  fieldGroup: {
    gap: 5,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5C4A42',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  forgotLink: {
    fontSize: 11,
    color: '#A85A3C',
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDFBF8',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  inputRowError: {
    borderColor: '#B45339',
    backgroundColor: '#FFF8F6',
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#2C1A14',
    padding: 0,
  },
  visibilityToggle: {
    padding: 2,
  },
  errorLabel: {
    fontSize: 11,
    color: '#B45339',
    fontWeight: '500',
    marginTop: 2,
  },
  checkboxLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 3,
  },
  checkboxBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#C6B9AC',
    backgroundColor: '#FAF7F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#A85A3C',
    borderColor: '#A85A3C',
  },
  checkboxBoxError: {
    borderColor: '#B45339',
  },
  checkboxTitle: {
    fontSize: 12,
    color: '#5C4A42',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FAF7F2',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  secondaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6D5B53',
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#2C1A14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  strengthTrack: {
    flex: 1,
    height: 3,
    backgroundColor: '#EBE2D8',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  selectTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FDFBF8',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  selectTriggerText: {
    fontSize: 13,
    color: '#2C1A14',
    fontWeight: '500',
  },
  dropdownSheet: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    borderRadius: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0E8DF',
  },
  dropdownLineActive: {
    backgroundColor: '#FAF5EE',
  },
  dropdownLineText: {
    fontSize: 12,
    color: '#5C4A42',
  },
  dropdownLineTextActive: {
    color: '#A85A3C',
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cadenceChip: {
    backgroundColor: '#FDFBF8',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  cadenceChipActive: {
    backgroundColor: '#2C1A14',
    borderColor: '#2C1A14',
  },
  cadenceChipText: {
    fontSize: 12,
    color: '#6D5B53',
    fontWeight: '500',
  },
  cadenceChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dietaryPill: {
    backgroundColor: '#F8F4EE',
    borderWidth: 1,
    borderColor: '#EAE1D7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  dietaryPillActive: {
    backgroundColor: '#FAF5EE',
    borderColor: '#A85A3C',
  },
  dietaryPillText: {
    fontSize: 11,
    color: '#7D6A62',
  },
  dietaryPillTextActive: {
    color: '#A85A3C',
    fontWeight: '600',
  },
  switchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF6F1',
    borderWidth: 1,
    borderColor: '#EAE1D7',
    borderRadius: 10,
    padding: 12,
  },
  switchInfo: {
    flex: 1,
    paddingRight: 10,
  },
  switchTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C1A14',
  },
  switchSubtitle: {
    fontSize: 10,
    color: '#8D7B73',
    marginTop: 2,
    lineHeight: 14,
  },
  multilineArea: {
    backgroundColor: '#FDFBF8',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#2C1A14',
    height: 70,
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE1D7',
    borderRadius: 16,
    maxWidth: 520,
    width: '100%',
    padding: 20,
    gap: 16,
  },
  guideStepRow: {
    flexDirection: 'row',
    gap: 8,
  },
  guidePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8F4EE',
    borderWidth: 1,
    borderColor: '#E8DED3',
    alignItems: 'center',
  },
  guidePillActive: {
    backgroundColor: '#2C1A14',
    borderColor: '#2C1A14',
  },
  guidePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7D6A62',
  },
  guidePillTextActive: {
    color: '#FFFFFF',
  },
  guideBlock: {
    gap: 10,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C1A14',
  },
  guideText: {
    fontSize: 12,
    color: '#6D5B53',
    lineHeight: 18,
  },
  guideCodeItem: {
    backgroundColor: '#FAF6F1',
    borderWidth: 1,
    borderColor: '#EAE1D7',
    borderRadius: 8,
    padding: 10,
    gap: 3,
  },
  guideCodeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A85A3C',
  },
  guideCodeDetail: {
    fontSize: 11,
    color: '#6D5B53',
    fontFamily: 'monospace',
  },
  codeSnippet: {
    backgroundColor: '#2C1A14',
    borderRadius: 8,
    padding: 12,
  },
  snippetText: {
    fontSize: 11,
    color: '#E8DDD4',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 12, 9, 0.45)',
    justifyContent: 'flex-end',
  },
  consoleSheet: {
    backgroundColor: '#1E1410',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: 380,
    borderWidth: 1,
    borderColor: '#382822',
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2D1E18',
  },
  consoleTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  consoleSheetTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F4EBE3',
    fontFamily: 'monospace',
  },
  logCountBadge: {
    backgroundColor: '#352520',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  logCountText: {
    fontSize: 10,
    color: '#C88A58',
    fontWeight: '600',
  },
  consoleHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sheetActionBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#2D1E18',
  },
  sheetActionText: {
    fontSize: 11,
    color: '#B5A59B',
  },
  closeBtn: {
    padding: 4,
  },
  consoleBody: {
    padding: 16,
  },
  emptyLogsView: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyLogsText: {
    fontSize: 12,
    color: '#8D7B73',
    textAlign: 'center',
    lineHeight: 18,
  },
  logEntry: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
  },
  logEntrySuccess: {
    backgroundColor: '#17221A',
    borderColor: '#243C2C',
  },
  logEntryError: {
    backgroundColor: '#2A1715',
    borderColor: '#482420',
  },
  logEntryInfo: {
    backgroundColor: '#261C18',
    borderColor: '#382822',
  },
  logEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  logTimestamp: {
    fontSize: 10,
    color: '#9C8B82',
    fontFamily: 'monospace',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  copyBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#A85A3C',
  },
  logTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  logMessage: {
    fontSize: 11,
    color: '#D4C6BD',
  },
  jsonTerminalBox: {
    backgroundColor: '#120B08',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  jsonTerminalText: {
    fontSize: 11,
    color: '#E6D7CD',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
