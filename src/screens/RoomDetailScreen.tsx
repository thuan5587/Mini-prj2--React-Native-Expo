import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { TimeSlot, Booking } from '../types';
import { getTodayDateString, formatDisplayDate } from '../utils/dateUtils';
import { useBookingStore } from '../store/useBookingStore';
import { DateSelector } from '../components/DateSelector';
import { TimeSlotGrid } from '../components/TimeSlotGrid';
import { StatusBadge, CapacityBadge, BuildingBadge, EquipmentChip } from '../components/Badge';
import { BookingPassModal } from '../components/BookingPassModal';

type DetailRouteProp = RouteProp<RootStackParamList, 'RoomDetail'>;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList>;

export function RoomDetailScreen() {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<DetailNavProp>();
  const { room } = route.params;

  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [purpose, setPurpose] = useState('');
  const [groupSize, setGroupSize] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [passModalVisible, setPassModalVisible] = useState(false);

  const createBooking = useBookingStore((s) => s.createBooking);
  const isRoomAvailableNow = useBookingStore((s) => s.isRoomAvailableNow);
  const user = useBookingStore((s) => s.user);

  const isAvailable = useMemo(() => isRoomAvailableNow(room.id), [room.id, isRoomAvailableNow]);

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot) {
      Alert.alert('Chưa chọn ca', 'Vui lòng chọn một ca học còn trống để tiếp tục.');
      return;
    }

    if (groupSize > room.capacity) {
      Alert.alert('Vượt quá sức chứa', `Phòng này tối đa ${room.capacity} sinh viên.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createBooking({
        roomId: room.id,
        roomName: room.name,
        building: room.building,
        roomNumber: room.roomNumber,
        roomImage: room.image,
        date: selectedDate,
        slotId: selectedSlot.id,
        slotStartTime: selectedSlot.startTime,
        slotEndTime: selectedSlot.endTime,
        purpose: purpose.trim() || 'Học tập & Thảo luận nhóm môn học VKU',
        groupSize,
      });

      if (!res.success || !res.booking) {
        Alert.alert('Không thể đặt phòng', res.error || 'Đã có lỗi xảy ra.');
        return;
      }

      setCreatedBooking(res.booking);
      setPassModalVisible(true);
      // Reset selection
      setSelectedSlot(null);
      setPurpose('');
    } catch (err: any) {
      Alert.alert('Lỗi', err.message || 'Không thể tạo đặt phòng');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />
          
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color="#0F172A" />
          </TouchableOpacity>

          <View style={styles.imageStatusBadge}>
            <StatusBadge isAvailable={isAvailable} size="medium" />
          </View>
        </View>

        {/* Room Header Info */}
        <View style={styles.roomHeader}>
          <View style={styles.metaRow}>
            <BuildingBadge building={room.building} floor={room.floor} />
            <CapacityBadge capacity={room.capacity} />
            <View style={styles.roomNumberPill}>
              <Text style={styles.roomNumberPillText}>{room.roomNumber}</Text>
            </View>
          </View>

          <Text style={styles.roomTitle}>{room.name}</Text>
          <Text style={styles.roomDescription}>{room.description}</Text>
        </View>

        {/* Specifications / Hardware */}
        {room.specs && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Thông số kỹ thuật & Trang bị</Text>
            <View style={styles.specsCard}>
              {room.specs.pcCount && (
                <View style={styles.specItem}>
                  <Ionicons name="desktop" size={16} color="#1D4ED8" />
                  <Text style={styles.specText}>
                    Số lượng máy tính: <Text style={styles.specHighlight}>{room.specs.pcCount} máy trạm</Text>
                  </Text>
                </View>
              )}
              {room.specs.pcSpecs && (
                <View style={styles.specItem}>
                  <Ionicons name="hardware-chip" size={16} color="#1D4ED8" />
                  <Text style={styles.specText}>
                    Cấu hình: <Text style={styles.specHighlight}>{room.specs.pcSpecs}</Text>
                  </Text>
                </View>
              )}
              {room.specs.screenSize && (
                <View style={styles.specItem}>
                  <Ionicons name="tv" size={16} color="#1D4ED8" />
                  <Text style={styles.specText}>
                    Màn hình trình chiếu: <Text style={styles.specHighlight}>{room.specs.screenSize}</Text>
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Equipments */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Tiện ích trong phòng</Text>
          <View style={styles.equipmentGrid}>
            {room.equipment.map((eq) => (
              <EquipmentChip key={eq} type={eq} />
            ))}
          </View>
        </View>

        {/* Rules */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Quy định sử dụng</Text>
          <View style={styles.rulesCard}>
            {room.rules.map((rule, idx) => (
              <View key={idx} style={styles.ruleItem}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
                <Text style={styles.ruleText}>{rule}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 7-Day Date Selector */}
        <DateSelector
          selectedDate={selectedDate}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setSelectedSlot(null);
          }}
        />

        {/* Discrete 2-Hour Time Slots with Conflict Engine */}
        <TimeSlotGrid
          roomId={room.id}
          selectedDate={selectedDate}
          selectedSlotId={selectedSlot?.id || null}
          onSelectSlot={handleSelectSlot}
        />

        {/* Booking Form Details (when slot selected) */}
        {selectedSlot && (
          <View style={styles.bookingFormCard}>
            <View style={styles.selectedSlotSummary}>
              <Ionicons name="calendar" size={18} color="#1D4ED8" />
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryTitle}>Đã chọn ca học</Text>
                <Text style={styles.summaryDateText}>
                  {formatDisplayDate(selectedDate)} • {selectedSlot.label}
                </Text>
              </View>
            </View>

            {/* Purpose input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mục đích sử dụng phòng:</Text>
              <TextInput
                style={styles.textInput}
                placeholder="VD: Họp nhóm Capstone, Ôn thi môn Lập trình..."
                placeholderTextColor="#94A3B8"
                value={purpose}
                onChangeText={setPurpose}
              />
            </View>

            {/* Group size */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Số lượng sinh viên tham gia (Tối đa {room.capacity}):
              </Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setGroupSize(Math.max(1, groupSize - 1))}
                >
                  <Ionicons name="remove" size={18} color="#1D4ED8" />
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{groupSize} sinh viên</Text>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setGroupSize(Math.min(room.capacity, groupSize + 1))}
                >
                  <Ionicons name="add" size={18} color="#1D4ED8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Student info confirmation */}
            <View style={styles.studentConfirmBox}>
              <Ionicons name="person-circle-outline" size={18} color="#64748B" />
              <Text style={styles.studentConfirmText}>
                Người đăng ký: <Text style={{ fontWeight: '700' }}>{user.fullName}</Text> ({user.studentId})
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Floating Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomBarLeft}>
          <Text style={styles.bottomPriceLabel}>Phòng thực hành VKU</Text>
          <Text style={styles.bottomSlotLabel}>
            {selectedSlot ? selectedSlot.label : 'Chọn ca ở trên'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedSlot || isSubmitting) && styles.bookButtonDisabled,
          ]}
          disabled={!selectedSlot || isSubmitting}
          onPress={handleConfirmBooking}
        >
          <Text style={styles.bookButtonText}>
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận giữ chỗ'}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Unique Booking Pass & QR Modal */}
      <BookingPassModal
        visible={passModalVisible}
        booking={createdBooking}
        onClose={() => setPassModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
    backgroundColor: '#0F294A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 20,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageStatusBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  roomHeader: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  roomNumberPill: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roomNumberPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  roomTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  roomDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  specsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 8,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  specText: {
    fontSize: 13,
    color: '#1E3A8A',
    flex: 1,
  },
  specHighlight: {
    fontWeight: '700',
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  rulesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  ruleText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
    lineHeight: 18,
  },
  bookingFormCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    elevation: 2,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  selectedSlotSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginBottom: 14,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
  },
  summaryDateText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  studentConfirmBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 8,
    gap: 6,
    marginTop: 4,
  },
  studentConfirmText: {
    fontSize: 12,
    color: '#475569',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  bottomBarLeft: {
    flex: 1,
  },
  bottomPriceLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  bottomSlotLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  bookButton: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  bookButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
