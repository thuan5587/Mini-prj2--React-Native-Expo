import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Room } from '../types';
import { StatusBadge, CapacityBadge, BuildingBadge, EquipmentChip } from './Badge';

interface RoomCardProps {
  room: Room;
  isAvailableNow: boolean;
  onPress: (room: Room) => void;
}

const RoomCardComponent: React.FC<RoomCardProps> = ({ room, isAvailableNow, onPress }) => {
  const handlePress = () => {
    onPress(room);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={handlePress}
      android_ripple={{ color: '#E0E7FF' }}
    >
      {/* Image Container with Badges */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Availability Badge Overlay */}
        <View style={styles.badgeOverlay}>
          <StatusBadge isAvailable={isAvailableNow} size="medium" />
        </View>

        {/* Room Code Badge */}
        <View style={styles.codeOverlay}>
          <Text style={styles.codeText}>{room.roomNumber}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Meta row: Building & Capacity */}
        <View style={styles.metaRow}>
          <BuildingBadge building={room.building} floor={room.floor} />
          <CapacityBadge capacity={room.capacity} />
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {room.name}
        </Text>

        {/* Description snippet */}
        <Text style={styles.description} numberOfLines={2}>
          {room.description}
        </Text>

        {/* Equipment Badges Preview */}
        <View style={styles.equipmentRow}>
          {room.equipment.slice(0, 3).map((eq) => (
            <EquipmentChip key={eq} type={eq} compact />
          ))}
          {room.equipment.length > 3 && (
            <View style={styles.moreEquipmentBadge}>
              <Text style={styles.moreEquipmentText}>
                +{room.equipment.length - 3}
              </Text>
            </View>
          )}
        </View>

        {/* Footer / CTA Row */}
        <View style={styles.footerRow}>
          <View style={styles.timeInfo}>
            <Ionicons name="time-outline" size={14} color="#6B7280" />
            <Text style={styles.timeInfoText}>Ca 2h • 7:30 - 19:30</Text>
          </View>

          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>Chọn ca</Text>
            <Ionicons name="chevron-forward" size={14} color="#1D4ED8" />
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export const RoomCard = React.memo(RoomCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
      },
    }),
  },
  cardPressed: {
    opacity: 0.96,
    transform: [{ scale: 0.995 }],
  },
  imageContainer: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  codeOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  content: {
    padding: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  moreEquipmentBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreEquipmentText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeInfoText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 2,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D4ED8',
  },
});
