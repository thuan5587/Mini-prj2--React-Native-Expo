import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TimeSlot } from '../types';
import { TIME_SLOTS, isSlotPastForToday } from '../utils/dateUtils';
import { useBookingStore } from '../store/useBookingStore';

interface TimeSlotGridProps {
  roomId: string;
  selectedDate: string;
  selectedSlotId: string | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  roomId,
  selectedDate,
  selectedSlotId,
  onSelectSlot,
}) => {
  const isSlotBooked = useBookingStore((s) => s.isSlotBooked);
  const getBookingForSlot = useBookingStore((s) => s.getBookingForSlot);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Chọn ca học (2 giờ / ca)</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Trống</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Đã đặt</Text>
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        {TIME_SLOTS.map((slot, index) => {
          const isBooked = isSlotBooked(roomId, selectedDate, slot.id);
          const isPast = isSlotPastForToday(selectedDate, slot.endTime);
          const isSelected = selectedSlotId === slot.id;
          const isDisabled = isBooked || isPast;

          const bookingInfo = isBooked
            ? getBookingForSlot(roomId, selectedDate, slot.id)
            : null;

          return (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.slotCard,
                isSelected && styles.slotCardSelected,
                isBooked && styles.slotCardBooked,
                isPast && styles.slotCardPast,
              ]}
              disabled={isDisabled}
              onPress={() => onSelectSlot(slot)}
              activeOpacity={0.7}
            >
              {/* Ca header */}
              <View style={styles.slotHeader}>
                <Text
                  style={[
                    styles.caLabel,
                    isSelected && styles.textSelected,
                    isDisabled && styles.textDisabled,
                  ]}
                >
                  Ca {index + 1}
                </Text>

                {/* Status indicator */}
                {isBooked ? (
                  <View style={styles.statusBadgeBooked}>
                    <Ionicons name="close-circle" size={11} color="#DC2626" />
                    <Text style={styles.statusTextBooked}>Đã đặt</Text>
                  </View>
                ) : isPast ? (
                  <View style={styles.statusBadgePast}>
                    <Text style={styles.statusTextPast}>Hết giờ</Text>
                  </View>
                ) : isSelected ? (
                  <View style={styles.statusBadgeSelected}>
                    <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" />
                  </View>
                ) : (
                  <View style={styles.statusBadgeAvailable}>
                    <Ionicons name="ellipse" size={7} color="#10B981" />
                    <Text style={styles.statusTextAvailable}>Trống</Text>
                  </View>
                )}
              </View>

              {/* Time display */}
              <View style={styles.timeContainer}>
                <Ionicons
                  name="time-outline"
                  size={15}
                  color={isSelected ? '#FFFFFF' : isDisabled ? '#94A3B8' : '#1D4ED8'}
                />
                <Text
                  style={[
                    styles.timeText,
                    isSelected && styles.timeTextSelected,
                    isDisabled && styles.timeTextDisabled,
                  ]}
                >
                  {slot.label}
                </Text>
              </View>

              {/* Conflict explanation if booked */}
              {isBooked && bookingInfo && (
                <View style={styles.conflictInfo}>
                  <Text style={styles.conflictInfoText} numberOfLines={1}>
                    Khóa bởi: {bookingInfo.studentName || 'SV khác'}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  grid: {
    gap: 10,
  },
  slotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  slotCardSelected: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  slotCardBooked: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    opacity: 0.85,
  },
  slotCardPast: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.5,
  },
  slotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  caLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textSelected: {
    color: '#E0E7FF',
  },
  textDisabled: {
    color: '#94A3B8',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  timeTextSelected: {
    color: '#FFFFFF',
  },
  timeTextDisabled: {
    color: '#94A3B8',
  },
  statusBadgeAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  statusTextAvailable: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065F46',
  },
  statusBadgeBooked: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  statusTextBooked: {
    fontSize: 11,
    fontWeight: '600',
    color: '#991B1B',
  },
  statusBadgePast: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusTextPast: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  statusBadgeSelected: {
    padding: 2,
  },
  conflictInfo: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#FECACA',
  },
  conflictInfoText: {
    fontSize: 11,
    color: '#B91C1C',
    fontWeight: '500',
  },
});
