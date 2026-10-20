import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

// Minimalist User Silhouette
export function UserIcon({ size = 16, color = '#7D6A62' }: IconProps) {
  const headSize = Math.round(size * 0.44);
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: headSize,
          height: headSize,
          borderRadius: headSize / 2,
          borderWidth: 1.5,
          borderColor: color,
          marginBottom: 1,
        }}
      />
      <View
        style={{
          width: size * 0.82,
          height: size * 0.38,
          borderTopLeftRadius: size * 0.4,
          borderTopRightRadius: size * 0.4,
          borderWidth: 1.5,
          borderColor: color,
          borderBottomWidth: 0,
        }}
      />
    </View>
  );
}

// Minimalist Envelope
export function MailIcon({ size = 16, color = '#7D6A62' }: IconProps) {
  const width = size;
  const height = Math.round(size * 0.72);
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width,
          height,
          borderWidth: 1.5,
          borderColor: color,
          borderRadius: 3,
          justifyContent: 'flex-start',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: width * 0.7,
            height: width * 0.45,
            borderBottomWidth: 1.5,
            borderRightWidth: 1.5,
            borderColor: color,
            transform: [{ rotate: '45deg' }, { translateY: -width * 0.18 }],
          }}
        />
      </View>
    </View>
  );
}

// Minimalist Padlock
export function LockIcon({ size = 16, color = '#7D6A62' }: IconProps) {
  const bodyW = Math.round(size * 0.75);
  const bodyH = Math.round(size * 0.55);
  const shackleW = Math.round(size * 0.45);
  const shackleH = Math.round(size * 0.45);

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: shackleW,
          height: shackleH,
          borderTopLeftRadius: shackleW / 2,
          borderTopRightRadius: shackleW / 2,
          borderWidth: 1.5,
          borderColor: color,
          borderBottomWidth: 0,
          marginBottom: -1,
        }}
      />
      <View
        style={{
          width: bodyW,
          height: bodyH,
          borderRadius: 2.5,
          borderWidth: 1.5,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 2,
            height: 3,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
      </View>
    </View>
  );
}

// Minimalist Eye (Show Password)
export function EyeIcon({ size = 16, color = '#7D6A62' }: IconProps) {
  const w = size;
  const h = Math.round(size * 0.6);
  const pupil = Math.round(size * 0.28);

  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: w,
          height: h,
          borderRadius: h / 2,
          borderWidth: 1.5,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: pupil,
            height: pupil,
            borderRadius: pupil / 2,
            backgroundColor: color,
          }}
        />
      </View>
    </View>
  );
}

// Minimalist EyeOff (Hide Password)
export function EyeOffIcon({ size = 16, color = '#7D6A62' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <EyeIcon size={size} color={color} />
      <View
        style={{
          position: 'absolute',
          width: size * 1.1,
          height: 1.5,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

// Minimalist Phone
export function PhoneIcon({ size = 16, color = '#7D6A62' }: IconProps) {
  const w = Math.round(size * 0.58);
  const h = Math.round(size * 0.95);
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: w,
          height: h,
          borderRadius: 3.5,
          borderWidth: 1.5,
          borderColor: color,
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: 2,
        }}
      >
        <View style={{ width: w * 0.35, height: 1.2, backgroundColor: color }} />
        <View
          style={{
            width: 3,
            height: 3,
            borderRadius: 1.5,
            borderWidth: 1,
            borderColor: color,
          }}
        />
      </View>
    </View>
  );
}

// Minimalist Chevron Down
export function ChevronDownIcon({ size = 14, color = '#7D6A62' }: IconProps) {
  const s = Math.round(size * 0.38);
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: s,
          height: s,
          borderRightWidth: 1.5,
          borderBottomWidth: 1.5,
          borderColor: color,
          transform: [{ rotate: '45deg' }, { translateY: -1 }],
        }}
      />
    </View>
  );
}

// Minimalist Checkmark
export function CheckIcon({ size = 14, color = '#FFFFFF' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          width: size * 0.32,
          height: size * 0.55,
          borderRightWidth: 1.8,
          borderBottomWidth: 1.8,
          borderColor: color,
          transform: [{ rotate: '45deg' }, { translateY: -1 }],
        }}
      />
    </View>
  );
}

// Minimalist Close / Dismiss (X)
export function CloseIcon({ size = 16, color = '#7D6A62' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          position: 'absolute',
          width: size * 0.75,
          height: 1.5,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: size * 0.75,
          height: 1.5,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </View>
  );
}

// Minimalist Code / Console Icon: { }
export function CodeIcon({ size = 16, color = '#2C1A14' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <Text
        style={{
          fontSize: size * 0.8,
          fontWeight: '700',
          color,
          fontFamily: 'monospace',
          lineHeight: size,
        }}
      >
        &#123;&nbsp;&#125;
      </Text>
    </View>
  );
}

// Minimalist Copy Icon
export function CopyIcon({ size = 14, color = '#7D6A62' }: IconProps) {
  const box = Math.round(size * 0.65);
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <View
        style={{
          position: 'absolute',
          top: 1,
          left: 1,
          width: box,
          height: box,
          borderRadius: 2,
          borderWidth: 1.2,
          borderColor: color,
          opacity: 0.6,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 1,
          right: 1,
          width: box,
          height: box,
          borderRadius: 2,
          borderWidth: 1.4,
          borderColor: color,
          backgroundColor: '#FFFFFF',
        }}
      />
    </View>
  );
}

// Minimalist Reset Arrow
export function RotateCcwIcon({ size = 14, color = '#7D6A62' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.9, color, lineHeight: size }}>↺</Text>
    </View>
  );
}

// Minimalist Artisanal Bakery Monogram / Emblem
export function BakeryEmblem({ size = 32, color = '#2E1E18' }: IconProps) {
  return (
    <View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.2,
          borderColor: '#D8CBC0',
          backgroundColor: '#FAF5EE',
        },
      ]}
    >
      <Text
        style={{
          fontSize: size * 0.42,
          fontWeight: '700',
          color,
          fontFamily: 'serif',
          letterSpacing: 0.5,
        }}
      >
        M
      </Text>
    </View>
  );
}

// Minimalist Wheat Spig / Flour Motif (Textile/Artisan accent)
export function ArtisanSparkle({ size = 14, color = '#A85A3C' }: IconProps) {
  return (
    <View style={[styles.center, { width: size, height: size }]}>
      <Text style={{ fontSize: size * 0.75, color, lineHeight: size }}>✦</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
