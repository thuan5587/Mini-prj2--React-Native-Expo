import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { EquipmentType } from '../types';

interface StatusBadgeProps {
  isAvailable: boolean;
  size?: 'small' | 'medium';
}

export function StatusBadge({ isAvailable, size = 'small' }: StatusBadgeProps) {
  const isSmall = size === 'small';
  return (
    <View
      style={[
        styles.badge,
        isAvailable ? styles.availableBadge : styles.occupiedBadge,
        isSmall ? styles.badgeSmall : styles.badgeMedium,
      ]}
    >
      <View
        style={[
          styles.statusDot,
          isAvailable ? styles.availableDot : styles.occupiedDot,
        ]}
      />
      <Text
        style={[
          styles.badgeText,
          isAvailable ? styles.availableText : styles.occupiedText,
          isSmall && styles.badgeTextSmall,
        ]}
      >
        {isAvailable ? 'Trống ngay' : 'Đang có người'}
      </Text>
    </View>
  );
}

interface CapacityBadgeProps {
  capacity: number;
}

export function CapacityBadge({ capacity }: CapacityBadgeProps) {
  return (
    <View style={styles.capacityBadge}>
      <Ionicons name="people-outline" size={13} color="#4B5563" />
      <Text style={styles.capacityText}>{capacity} chỗ</Text>
    </View>
  );
}

interface BuildingBadgeProps {
  building: string;
  floor: number;
}

export function BuildingBadge({ building, floor }: BuildingBadgeProps) {
  return (
    <View style={styles.buildingBadge}>
      <Ionicons name="business-outline" size={13} color="#1D4ED8" />
      <Text style={styles.buildingText}>
        Khu {building} • Tầng {floor}
      </Text>
    </View>
  );
}

interface EquipmentChipProps {
  type: EquipmentType;
  selected?: boolean;
  onPress?: () => void;
  compact?: boolean;
}

export function EquipmentChip({ type, compact = false }: EquipmentChipProps) {
  const getEquipmentConfig = (eq: EquipmentType) => {
    switch (eq) {
      case 'high_spec_pc':
        return { label: 'PC cấu hình cao', icon: 'desktop-outline' };
      case 'projector':
        return { label: 'Máy chiếu', icon: 'videocam-outline' };
      case 'whiteboard':
        return { label: 'Bảng từ', icon: 'easel-outline' };
      case 'air_conditioner':
        return { label: 'Điều hòa', icon: 'snow-outline' };
      case 'power_outlets':
        return { label: 'Ổ điện riêng', icon: 'flash-outline' };
      case 'wifi_6':
        return { label: 'Wifi 6', icon: 'wifi-outline' };
      default:
        return { label: eq, icon: 'hardware-chip-outline' };
    }
  };

  const config = getEquipmentConfig(type);

  return (
    <View style={[styles.equipmentChip, compact && styles.equipmentChipCompact]}>
      <Ionicons name={config.icon as any} size={compact ? 12 : 14} color="#374151" />
      <Text style={[styles.equipmentText, compact && styles.equipmentTextCompact]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  availableBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  occupiedBadge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  availableDot: {
    backgroundColor: '#10B981',
  },
  occupiedDot: {
    backgroundColor: '#EF4444',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextSmall: {
    fontSize: 11,
  },
  availableText: {
    color: '#065F46',
  },
  occupiedText: {
    color: '#991B1B',
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  capacityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  buildingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  buildingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  equipmentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 5,
  },
  equipmentChipCompact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 3,
  },
  equipmentText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  equipmentTextCompact: {
    fontSize: 11,
  },
});
