import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabParamList } from '../navigation/types';
import { Booking, BookingStatus } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';
import { useBookingStore } from '../store/useBookingStore';
import { BookingPassModal } from '../components/BookingPassModal';

type TabNav = BottomTabNavigationProp<BottomTabParamList, 'MyBookingsTab'>;
type FilterTab = 'ALL' | 'ACTIVE' | 'CHECKED_IN' | 'CANCELLED';

export function MyBookingsScreen() {
  const navigation = useNavigation<TabNav>();
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>('ALL');
  const [selectedBookingForPass, setSelectedBookingForPass] = useState<Booking | null>(null);

  const bookings = useBookingStore((s) => s.bookings);
  const user = useBookingStore((s) => s.user);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);

  // Filter bookings for current student
  const studentBookings = useMemo(() => {
    return bookings.filter((b) => b.studentId === user.studentId);
  }, [bookings, user.studentId]);

  const filteredList = useMemo(() => {
    return studentBookings.filter((b) => {
      if (selectedFilter === 'ACTIVE') return b.status === 'confirmed';
      if (selectedFilter === 'CHECKED_IN') return b.status === 'checked_in';
      if (selectedFilter === 'CANCELLED') return b.status === 'cancelled';
      return true;
    });
  }, [studentBookings, selectedFilter]);

  const handleCancel = (booking: Booking) => {
    Alert.alert(
      'Hủy đặt phòng',
      `Bạn có chắc chắn muốn hủy lịch tại ${booking.roomNumber} (${booking.slotStartTime} - ${booking.slotEndTime})?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy phòng',
          style: 'destructive',
          onPress: async () => {
            await cancelBooking(booking.id);
          },
        },
      ]
    );
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Sắp tới',
          color: '#1D4ED8',
          bg: '#EFF6FF',
          border: '#BFDBFE',
          icon: 'time-outline',
        };
      case 'checked_in':
        return {
          label: 'Đã check-in',
          color: '#059669',
          bg: '#ECFDF5',
          border: '#A7F3D0',
          icon: 'checkmark-circle-outline',
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: '#DC2626',
          bg: '#FEF2F2',
          border: '#FECACA',
          icon: 'close-circle-outline',
        };
      case 'completed':
        return {
          label: 'Đã hoàn thành',
          color: '#4B5563',
          bg: '#F3F4F6',
          border: '#E5E7EB',
          icon: 'checkmark-done-outline',
        };
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F294A" />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch Đặt Phòng Của Tôi</Text>
        <Text style={styles.headerSubtitle}>
          Quản lý ca giữ chỗ, quét mã QR Check-in & Thông báo
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabsRow}>
        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'ALL' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('ALL')}
        >
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === 'ALL' && styles.filterTabTextActive,
            ]}
          >
            Tất cả ({studentBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterTab, selectedFilter === 'ACTIVE' && styles.filterTabActive]}
          onPress={() => setSelectedFilter('ACTIVE')}
        >
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === 'ACTIVE' && styles.filterTabTextActive,
            ]}
          >
            Sắp tới ({studentBookings.filter((b) => b.status === 'confirmed').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'CHECKED_IN' && styles.filterTabActive,
          ]}
          onPress={() => setSelectedFilter('CHECKED_IN')}
        >
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === 'CHECKED_IN' && styles.filterTabTextActive,
            ]}
          >
            Đã check-in ({studentBookings.filter((b) => b.status === 'checked_in').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            selectedFilter === 'CANCELLED' && styles.filterTabActive,
          ]}
          onPress={() => setSelectedFilter('CANCELLED')}
        >
          <Text
            style={[
              styles.filterTabText,
              selectedFilter === 'CANCELLED' && styles.filterTabTextActive,
            ]}
          >
            Đã hủy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={54} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Chưa có ca đặt phòng nào</Text>
            <Text style={styles.emptySubtitle}>
              Khám phá các phòng máy tính và phòng thảo luận nhóm tại cơ sở VKU để giữ chỗ ngay.
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('ExploreTab')}
            >
              <Text style={styles.exploreBtnText}>Tìm phòng ngay</Text>
              <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => {
          const badge = getStatusBadge(item.status);
          const isConfirmed = item.status === 'confirmed';

          return (
            <View style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <Image source={{ uri: item.roomImage }} style={styles.roomThumb} />
                <View style={styles.cardHeaderInfo}>
                  <View style={styles.roomCodeRow}>
                    <Text style={styles.roomCodeBadge}>{item.roomNumber}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: badge.bg,
                          borderColor: badge.border,
                        },
                      ]}
                    >
                      <Ionicons name={badge.icon as any} size={12} color={badge.color} />
                      <Text style={[styles.statusBadgeText, { color: badge.color }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.roomNameText} numberOfLines={1}>
                    {item.roomName}
                  </Text>
                  <Text style={styles.codeText}>Mã: {item.bookingCode}</Text>
                </View>
              </View>

              {/* Time & Date Info */}
              <View style={styles.timeInfoBox}>
                <View style={styles.timeInfoRow}>
                  <Ionicons name="calendar-outline" size={14} color="#1D4ED8" />
                  <Text style={styles.timeInfoText}>
                    {formatDisplayDate(item.date)}
                  </Text>
                </View>
                <View style={styles.timeInfoRow}>
                  <Ionicons name="time-outline" size={14} color="#1D4ED8" />
                  <Text style={[styles.timeInfoText, { fontWeight: '700' }]}>
                    {item.slotStartTime} - {item.slotEndTime}
                  </Text>
                </View>
              </View>

              {/* Purpose snippet */}
              <View style={styles.purposeRow}>
                <Ionicons name="document-text-outline" size={13} color="#64748B" />
                <Text style={styles.purposeText} numberOfLines={1}>
                  {item.purpose} • {item.groupSize} SV
                </Text>
              </View>

              {/* Actions Footer */}
              <View style={styles.cardFooter}>
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => setSelectedBookingForPass(item)}
                >
                  <Ionicons name="qr-code-outline" size={16} color="#1E40AF" />
                  <Text style={styles.qrButtonText}>Thẻ Check-in QR</Text>
                </TouchableOpacity>

                {isConfirmed && (
                  <TouchableOpacity
                    style={styles.cancelActionBtn}
                    onPress={() => handleCancel(item)}
                  >
                    <Ionicons name="close-circle-outline" size={15} color="#DC2626" />
                    <Text style={styles.cancelActionBtnText}>Hủy</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Booking Pass Modal */}
      <BookingPassModal
        visible={!!selectedBookingForPass}
        booking={selectedBookingForPass}
        onClose={() => setSelectedBookingForPass(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0F294A',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 14 : 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  filterTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  filterTabActive: {
    backgroundColor: '#1E40AF',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
    gap: 14,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  roomThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  cardHeaderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  roomCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  roomCodeBadge: {
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  roomNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  codeText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  timeInfoBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeInfoText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  purposeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  purposeText: {
    fontSize: 12,
    color: '#64748B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  qrButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E40AF',
  },
  cancelActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  cancelActionBtnText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#334155',
    marginTop: 14,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
