import React, { useState } from 'react';
import {
  Alert,
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
  BakeryEmblem,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  CodeIcon,
  CopyIcon,
  RotateCcwIcon,
  UserIcon,
} from '@/components/cake-shop/icons';

interface OrderPayload {
  orderReference: string;
  patron: {
    name: string;
    contactPhone: string;
  };
  commission: {
    flavor: string;
    portionSize: string;
    frosting: string;
    candleQuantity: number;
    sweetnessProfile: string;
    calligraphyInscription: string;
  };
  fulfillment: {
    method: 'pickup' | 'courier';
    slot: string;
  };
  dietaryCertification: {
    eggless: boolean;
    glutenFree: boolean;
    nutFree: boolean;
  };
  courtesyCardMessage: string;
  priorityKitchenBake: boolean;
  timestamp: string;
}

export default function OrderLabScreen() {
  // Form State
  const [patronName, setPatronName] = useState('Chloe Bennett');
  const [patronContact, setPatronContact] = useState('+1 (555) 789-0123');
  const [selectedFlavor, setSelectedFlavor] = useState('Valrhona Dark Chocolate');
  const [portionSize, setPortionSize] = useState('Atelier (12-16 portions)');
  const [frosting, setFrosting] = useState('Crème Mousseline');
  const [frostingDropdown, setFrostingDropdown] = useState(false);
  const [candleCount, setCandleCount] = useState(4);
  const [sweetness, setSweetness] = useState('Standard (100%)');
  const [calligraphy, setCalligraphy] = useState('Happy 25th Birthday Chloe');
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'pickup' | 'courier'>('courier');
  const [deliverySlot, setDeliverySlot] = useState('Afternoon (1:00 PM - 4:00 PM)');
  const [slotDropdown, setSlotDropdown] = useState(false);

  // Dietary Switches
  const [isEggless, setIsEggless] = useState(true);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [isNutFree, setIsNutFree] = useState(true);

  // Multiline Message
  const [courtesyMessage, setCourtesyMessage] = useState(
    'Wishing you the sweetest year ahead. With warmest love from our family to yours.'
  );
  const [priorityBake, setPriorityBake] = useState(false);

  // Console Modal state
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<OrderPayload | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Curated Options
  const flavors = [
    'Valrhona Dark Chocolate',
    'Tahitian Vanilla & Pear',
    'Pistachio Raspberry Frangipane',
    'Salted Caramel Praline',
    'Rose & Wild Berry Compote',
  ];

  const portions = [
    'Petite (6-8 portions)',
    'Atelier (12-16 portions)',
    'Grand (20-25 portions)',
    'Tiered Pièce Montée',
  ];

  const frostings = [
    'Crème Mousseline',
    'Valrhona Ganache Glaze',
    'Whipped Mascarpone',
    'Italian Meringue',
    'Velvet Cocoa Buttercream',
  ];

  const slots = [
    'Morning (9:00 AM - 12:00 PM)',
    'Afternoon (1:00 PM - 4:00 PM)',
    'Evening (5:00 PM - 8:00 PM)',
  ];

  const sweetnessOptions = ['Subtle (50%)', 'Standard (100%)', 'Decadent (125%)'];

  // Submit Handler
  const handleCommissionSubmit = () => {
    if (!patronName.trim()) {
      Alert.alert('Required', 'Please enter patron name.');
      return;
    }

    const payload: OrderPayload = {
      orderReference: `MC-${Date.now().toString().slice(-6)}`,
      patron: {
        name: patronName.trim(),
        contactPhone: patronContact.trim() || 'Unspecified',
      },
      commission: {
        flavor: selectedFlavor,
        portionSize,
        frosting,
        candleQuantity: candleCount,
        sweetnessProfile: sweetness,
        calligraphyInscription: calligraphy.trim() || 'None',
      },
      fulfillment: {
        method: fulfillmentMethod,
        slot: deliverySlot,
      },
      dietaryCertification: {
        eggless: isEggless,
        glutenFree: isGlutenFree,
        nutFree: isNutFree,
      },
      courtesyCardMessage: courtesyMessage.trim() || 'None',
      priorityKitchenBake: priorityBake,
      timestamp: new Date().toISOString(),
    };

    // 1. Output formatted JSON to the developer console
    console.log('\n=================== BESPOKE CAKE ORDER JSON ===================');
    console.log(JSON.stringify(payload, null, 2));
    console.log('===============================================================\n');

    // 2. Set state and toast
    setLastOrder(payload);
    setToastNotice(`✓ Commission ${payload.orderReference} logged · JSON emitted`);
    setTimeout(() => setToastNotice(null), 4000);
  };

  const handleReset = () => {
    setPatronName('');
    setPatronContact('');
    setCalligraphy('');
    setCourtesyMessage('');
    setCandleCount(0);
    setLastOrder(null);
  };

  const copyPayload = async () => {
    if (!lastOrder) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(JSON.stringify(lastOrder, null, 2));
      }
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    } catch {
      Alert.alert('JSON Copied', 'Check system terminal output.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* --- TOP BAR --- */}
      <View style={styles.topBar}>
        <View style={styles.topBarContent}>
          <View style={styles.brandRow}>
            <BakeryEmblem size={34} />
            <View>
              <Text style={styles.brandTitle}>Maison Crumb</Text>
              <Text style={styles.brandSubtitle}>Custom Commissions Atelier</Text>
            </View>
          </View>

          {/* Console Drawer Button */}
          <TouchableOpacity
            onPress={() => setIsConsoleOpen(true)}
            style={styles.consoleBtn}
            activeOpacity={0.8}
          >
            <CodeIcon size={14} color="#A85A3C" />
            <Text style={styles.consoleBtnText}>
              Console {lastOrder ? '(1)' : '(0)'}
            </Text>
            <View
              style={[
                styles.dot,
                lastOrder ? styles.dotActive : styles.dotInactive,
              ]}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- TOAST NOTIFICATION --- */}
      {toastNotice && (
        <View style={styles.toastBox}>
          <Text style={styles.toastText}>{toastNotice}</Text>
          <TouchableOpacity
            onPress={() => setIsConsoleOpen(true)}
            style={styles.toastAction}
          >
            <Text style={styles.toastActionText}>View JSON</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* --- MAIN CENTERED SCROLL CONTENT --- */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.centeredScroll}
      >
        <View style={styles.formCard}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>Bespoke Cake Commission</Text>
            <Text style={styles.cardHeaderSubtitle}>
              Tailored gateaux, personalized calligraphy & dietary adaptations
            </Text>
          </View>

          {/* Form Stack */}
          <View style={styles.cardBody}>
            {/* 1. Contact Information */}
            <Text style={styles.sectionTitle}>1. Patron Details</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Recipient / Patron Name</Text>
              <View style={styles.inputRow}>
                <UserIcon size={15} color="#8D7B73" />
                <TextInput
                  style={styles.input}
                  placeholder="Camille Laurent"
                  placeholderTextColor="#B9AEA6"
                  value={patronName}
                  onChangeText={setPatronName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Contact Phone for Chilled Courier</Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  placeholder="+1 (555) 000-0000"
                  placeholderTextColor="#B9AEA6"
                  value={patronContact}
                  onChangeText={setPatronContact}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* 2. Flavors & Tiers */}
            <Text style={styles.sectionTitle}>2. Flavor Profile & Sizing</Text>

            <View style={styles.field}>
              <Text style={styles.label}>Artisanal Sponge & Compote</Text>
              <View style={styles.chipWrap}>
                {flavors.map((flv) => (
                  <TouchableOpacity
                    key={flv}
                    onPress={() => setSelectedFlavor(flv)}
                    style={[
                      styles.chip,
                      selectedFlavor === flv && styles.chipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedFlavor === flv && styles.chipTextActive,
                      ]}
                    >
                      {flv}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Portion Size & Slices</Text>
              <View style={styles.chipWrap}>
                {portions.map((sz) => (
                  <TouchableOpacity
                    key={sz}
                    onPress={() => setPortionSize(sz)}
                    style={[
                      styles.sizePill,
                      portionSize === sz && styles.sizePillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sizePillText,
                        portionSize === sz && styles.sizePillTextActive,
                      ]}
                    >
                      {sz}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 3. Frosting & Steppers */}
            <Text style={styles.sectionTitle}>3. Finish & Sweetness</Text>

            {/* Frosting Dropdown */}
            <View style={styles.field}>
              <Text style={styles.label}>Frosting & Glaze Style</Text>
              <TouchableOpacity
                onPress={() => setFrostingDropdown(!frostingDropdown)}
                style={styles.selectBtn}
              >
                <Text style={styles.selectBtnText}>{frosting}</Text>
                <ChevronDownIcon size={12} color="#8D7B73" />
              </TouchableOpacity>

              {frostingDropdown && (
                <View style={styles.dropdownSheet}>
                  {frostings.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => {
                        setFrosting(opt);
                        setFrostingDropdown(false);
                      }}
                      style={[
                        styles.dropdownLine,
                        frosting === opt && styles.dropdownLineActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dropdownLineText,
                          frosting === opt && styles.dropdownLineTextActive,
                        ]}
                      >
                        {opt}
                      </Text>
                      {frosting === opt && <CheckIcon size={11} color="#A85A3C" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Counter Stepper: Candles */}
            <View style={styles.stepperContainer}>
              <View>
                <Text style={styles.stepperTitle}>Gold Leaf Celebration Candles</Text>
                <Text style={styles.stepperSubtitle}>Hand-dipped botanical wax candles</Text>
              </View>
              <View style={styles.stepperGroup}>
                <TouchableOpacity
                  onPress={() => setCandleCount(Math.max(0, candleCount - 1))}
                  style={styles.stepperBtn}
                >
                  <Text style={styles.stepperSign}>-</Text>
                </TouchableOpacity>

                <Text style={styles.stepperNum}>{candleCount}</Text>

                <TouchableOpacity
                  onPress={() => setCandleCount(candleCount + 1)}
                  style={styles.stepperBtn}
                >
                  <Text style={styles.stepperSign}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sweetness Profile Chips */}
            <View style={styles.field}>
              <Text style={styles.label}>Sweetness Level</Text>
              <View style={styles.chipWrap}>
                {sweetnessOptions.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => setSweetness(opt)}
                    style={[
                      styles.sweetPill,
                      sweetness === opt && styles.sweetPillActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sweetPillText,
                        sweetness === opt && styles.sweetPillTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 4. Calligraphy Inscription & Courtesy Note */}
            <Text style={styles.sectionTitle}>4. Calligraphy & Message</Text>

            <View style={styles.field}>
              <View style={styles.labelCountRow}>
                <Text style={styles.label}>Cake Piping Inscription</Text>
                <Text style={styles.charCount}>{calligraphy.length}/40</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. Happy 30th Birthday Sarah"
                placeholderTextColor="#B9AEA6"
                value={calligraphy}
                maxLength={40}
                onChangeText={setCalligraphy}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Courtesy Envelope Card (Multiline)</Text>
              <TextInput
                style={styles.multilineInput}
                placeholder="Message printed on textured linen paper..."
                placeholderTextColor="#B9AEA6"
                value={courtesyMessage}
                onChangeText={setCourtesyMessage}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* 5. Dietary Toggles */}
            <Text style={styles.sectionTitle}>5. Dietary Adaptations</Text>

            <View style={styles.switchBox}>
              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Eggless Recipe</Text>
                  <Text style={styles.switchSub}>Organic flaxseed & cultured yogurt base</Text>
                </View>
                <Switch
                  value={isEggless}
                  onValueChange={setIsEggless}
                  trackColor={{ false: '#E2DBD2', true: '#C36B4E' }}
                  thumbColor={isEggless ? '#FFFFFF' : '#F7F3EE'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Gluten-Free Sponge</Text>
                  <Text style={styles.switchSub}>Almond flour & toasted oat starch</Text>
                </View>
                <Switch
                  value={isGlutenFree}
                  onValueChange={setIsGlutenFree}
                  trackColor={{ false: '#E2DBD2', true: '#C36B4E' }}
                  thumbColor={isGlutenFree ? '#FFFFFF' : '#F7F3EE'}
                />
              </View>

              <View style={styles.divider} />

              <View style={styles.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchLabel}>Nut-Free Kitchen Guarantee</Text>
                  <Text style={styles.switchSub}>Prepared in certified clean allergen zone</Text>
                </View>
                <Switch
                  value={isNutFree}
                  onValueChange={setIsNutFree}
                  trackColor={{ false: '#E2DBD2', true: '#C36B4E' }}
                  thumbColor={isNutFree ? '#FFFFFF' : '#F7F3EE'}
                />
              </View>
            </View>

            {/* 6. Fulfillment Method & Slot */}
            <Text style={styles.sectionTitle}>6. Fulfillment</Text>

            <View style={styles.methodToggle}>
              <TouchableOpacity
                onPress={() => setFulfillmentMethod('pickup')}
                style={[
                  styles.methodBtn,
                  fulfillmentMethod === 'pickup' && styles.methodBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.methodText,
                    fulfillmentMethod === 'pickup' && styles.methodTextActive,
                  ]}
                >
                  Atelier Pickup
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFulfillmentMethod('courier')}
                style={[
                  styles.methodBtn,
                  fulfillmentMethod === 'courier' && styles.methodBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.methodText,
                    fulfillmentMethod === 'courier' && styles.methodTextActive,
                  ]}
                >
                  Chilled Courier
                </Text>
              </TouchableOpacity>
            </View>

            {/* Time Slot Dropdown */}
            <View style={styles.field}>
              <Text style={styles.label}>Scheduled Window</Text>
              <TouchableOpacity
                onPress={() => setSlotDropdown(!slotDropdown)}
                style={styles.selectBtn}
              >
                <Text style={styles.selectBtnText}>{deliverySlot}</Text>
                <ChevronDownIcon size={12} color="#8D7B73" />
              </TouchableOpacity>

              {slotDropdown && (
                <View style={styles.dropdownSheet}>
                  {slots.map((s) => (
                    <TouchableOpacity
                      key={s}
                      onPress={() => {
                        setDeliverySlot(s);
                        setSlotDropdown(false);
                      }}
                      style={[
                        styles.dropdownLine,
                        deliverySlot === s && styles.dropdownLineActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dropdownLineText,
                          deliverySlot === s && styles.dropdownLineTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                      {deliverySlot === s && <CheckIcon size={11} color="#A85A3C" />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Priority Kitchen Switch */}
            <View style={styles.rushBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rushTitle}>Priority Same-Day Preparation</Text>
                <Text style={styles.rushSub}>Expedited 3-hour kitchen scheduling</Text>
              </View>
              <Switch
                value={priorityBake}
                onValueChange={setPriorityBake}
                trackColor={{ false: '#E2DBD2', true: '#C36B4E' }}
                thumbColor={priorityBake ? '#FFFFFF' : '#F7F3EE'}
              />
            </View>

            {/* Submit & Reset Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
                <RotateCcwIcon size={13} color="#7D6A62" />
                <Text style={styles.resetBtnText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCommissionSubmit}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>Submit Commission</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* --- DEVELOPER CONSOLE MODAL SHEET --- */}
      <Modal
        visible={isConsoleOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsConsoleOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.consoleSheet}>
            <View style={styles.consoleHeader}>
              <View style={styles.consoleTitleGroup}>
                <CodeIcon size={16} color="#A85A3C" />
                <Text style={styles.consoleSheetTitle}>Commission Payload</Text>
              </View>

              <View style={styles.consoleHeaderActions}>
                {lastOrder && (
                  <TouchableOpacity
                    onPress={copyPayload}
                    style={styles.sheetCopyBtn}
                  >
                    <CopyIcon size={11} color="#A85A3C" />
                    <Text style={styles.sheetCopyText}>
                      {copiedPayload ? 'Copied' : 'Copy JSON'}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => setIsConsoleOpen(false)}
                  style={styles.closeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <CloseIcon size={14} color="#7D6A62" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.consoleBody}>
              {lastOrder ? (
                <View style={styles.jsonTerminalBox}>
                  <Text style={styles.jsonTerminalText}>
                    {JSON.stringify(lastOrder, null, 2)}
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyPrompt}>
                  <Text style={styles.emptyPromptText}>
                    No commission submitted yet.{'\n'}Configure your cake and tap "Submit Commission" to inspect the JSON object here.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==============================================================
// STYLESHEET
// ==============================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF6F0',
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
  consoleBtn: {
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
  consoleBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A85A3C',
    fontFamily: 'monospace',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: '#4A6B53',
  },
  dotInactive: {
    backgroundColor: '#D1C6BD',
  },
  toastBox: {
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
  },
  toastText: {
    fontSize: 12,
    color: '#FAF5EE',
    fontWeight: '500',
  },
  toastAction: {
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
  container: {
    flex: 1,
    backgroundColor: '#FAF6F0',
  },
  centeredScroll: {
    padding: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  formCard: {
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
  },
  cardBody: {
    padding: 24,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C1A14',
    letterSpacing: 0.3,
    marginTop: 6,
  },
  field: {
    gap: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5C4A42',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  labelCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 10,
    color: '#8D7B73',
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
  input: {
    backgroundColor: '#FDFBF8',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#2C1A14',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FDFBF8',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  chipActive: {
    backgroundColor: '#A85A3C',
    borderColor: '#A85A3C',
  },
  chipText: {
    fontSize: 12,
    color: '#6D5B53',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sizePill: {
    backgroundColor: '#FDFBF8',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
  },
  sizePillActive: {
    backgroundColor: '#2C1A14',
    borderColor: '#2C1A14',
  },
  sizePillText: {
    fontSize: 12,
    color: '#6D5B53',
    fontWeight: '500',
  },
  sizePillTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectBtn: {
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
  selectBtnText: {
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
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF6F1',
    borderWidth: 1,
    borderColor: '#EAE1D7',
    borderRadius: 10,
    padding: 12,
  },
  stepperTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C1A14',
  },
  stepperSubtitle: {
    fontSize: 10,
    color: '#8D7B73',
    marginTop: 1,
  },
  stepperGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepperBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperSign: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1A14',
    lineHeight: 18,
  },
  stepperNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2C1A14',
    minWidth: 18,
    textAlign: 'center',
  },
  sweetPill: {
    backgroundColor: '#FDFBF8',
    borderWidth: 1,
    borderColor: '#DFD5CA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  sweetPillActive: {
    backgroundColor: '#EFE5D8',
    borderColor: '#C88A58',
  },
  sweetPillText: {
    fontSize: 11,
    color: '#6D5B53',
  },
  sweetPillTextActive: {
    color: '#A85A3C',
    fontWeight: '600',
  },
  multilineInput: {
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
  switchBox: {
    backgroundColor: '#FAF6F1',
    borderWidth: 1,
    borderColor: '#EAE1D7',
    borderRadius: 10,
    padding: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C1A14',
  },
  switchSub: {
    fontSize: 10,
    color: '#8D7B73',
  },
  divider: {
    height: 1,
    backgroundColor: '#EBE2D8',
    marginVertical: 6,
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#EFE7DE',
    borderRadius: 10,
    padding: 3,
  },
  methodBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  methodBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  methodText: {
    fontSize: 12,
    color: '#7D6A62',
    fontWeight: '500',
  },
  methodTextActive: {
    color: '#2C1A14',
    fontWeight: '600',
  },
  rushBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#EAE0D4',
    borderRadius: 10,
    padding: 12,
  },
  rushTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#A85A3C',
  },
  rushSub: {
    fontSize: 10,
    color: '#8D7B73',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  resetBtn: {
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
  resetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6D5B53',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#2C1A14',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  submitBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
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
    maxHeight: '80%',
    minHeight: 320,
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
  consoleHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sheetCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#2D1E18',
  },
  sheetCopyText: {
    fontSize: 11,
    color: '#A85A3C',
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  consoleBody: {
    padding: 16,
  },
  jsonTerminalBox: {
    backgroundColor: '#120B08',
    borderRadius: 8,
    padding: 12,
  },
  jsonTerminalText: {
    fontSize: 11,
    color: '#E6D7CD',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  emptyPrompt: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  emptyPromptText: {
    fontSize: 12,
    color: '#8D7B73',
    textAlign: 'center',
    lineHeight: 18,
  },
});
