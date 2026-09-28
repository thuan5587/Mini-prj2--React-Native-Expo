import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { Booking } from '../types';
import { formatDisplayDate } from '../utils/dateUtils';
import { useBookingStore } from '../store/useBookingStore';

interface BookingPassModalProps {
  visible: boolean;
  booking: Booking | null;
  onClose: () => void;
}

export const BookingPassModal: React.FC<BookingPassModalProps> = ({
  visible,
  booking,
  onClose,
}) => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const checkInBooking = useBookingStore((s) => s.checkInBooking);
  const cancelBooking = useBookingStore((s) => s.cancelBooking);

  if (!booking) return null;

  const isCheckedIn = booking.status === 'checked_in';
  const isCancelled = booking.status === 'cancelled';

  const handleSimulateCheckIn = () => {
    setIsCheckingIn(true);
    setTimeout(() => {
      checkInBooking(booking.id);
      setIsCheckingIn(false);
      Alert.alert(
        '🎉 Check-in thành công!',
        `Chào mừng bạn đến ${booking.roomName}. Cửa phòng đã được mở tự động qua hệ thống IoT của VKU.`,
        [{ text: 'Tuyệt vời', style: 'default' }]
      );
    }, 600);
  };

  const handleCancelBooking = () => {
    Alert.alert(
      'Xác nhận hủy đặt phòng',
      `Bạn có chắc chắn muốn hủy ca học tại ${booking.roomNumber} (${booking.slotStartTime} - ${booking.slotEndTime})? Khung giờ này sẽ được mở lại cho sinh viên khác.`,
      [
        { text: 'Quay lại', style: 'cancel' },
        {
          text: 'Hủy phòng',
          style: 'destructive',
          onPress: async () => {
            await cancelBooking(booking.id);
            Alert.alert('Đã hủy', 'Ca đặt phòng đã được hủy thành công.');
            onClose();
          },
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Header Bar */}
          <View style={styles.header}>
            <View style={styles.headerIndicator} />
            <View style={styles.titleRow}>
              <View style={styles.vkuLogoBadge}>
                <Ionicons name="school" size={16} color="#1D4ED8" />
                <Text style={styles.vkuLogoText}>VKU SMART PASS</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Ionicons name="close" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* The Ticket Card */}
            <View style={styles.ticketCard}>
              {/* Ticket Top: Room & Code */}
              <View style={styles.ticketTop}>
                <Text style={styles.roomCodeBadge}>{booking.roomNumber}</Text>
                <Text style={styles.roomNameText}>{booking.roomName}</Text>
                <Text style={styles.bookingCodeText}>MÃ: {booking.bookingCode}</Text>
              </View>

              {/* Dashed Separator */}
              <View style={styles.dashedDividerContainer}>
                <View style={styles.halfCircleLeft} />
                <View style={styles.dashedLine} />
                <View style={styles.halfCircleRight} />
              </View>

              {/* Ticket Middle: QR Code */}
              <View style={styles.qrSection}>
                <View style={styles.qrWrapper}>
                  <QRCode
                    value={booking.qrPayload || booking.bookingCode}
                    size={170}
                    color="#0F172A"
                    backgroundColor="#FFFFFF"
                  />
                </View>

                {/* Status Pill */}
                <View
                  style={[
                    styles.statusPill,
                    isCheckedIn && styles.statusPillSuccess,
                    isCancelled && styles.statusPillCancelled,
                  ]}
                >
                  <Ionicons
                    name={
                      isCheckedIn
                        ? 'checkmark-circle'
                        : isCancelled
                        ? 'close-circle'
                        : 'time'
                    }
                    size={15}
                    color={
                      isCheckedIn
                        ? '#059669'
                        : isCancelled
                        ? '#DC2626'
                        : '#1D4ED8'
                    }
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      isCheckedIn && styles.statusPillTextSuccess,
                      isCancelled && styles.statusPillTextCancelled,
                    ]}
                  >
                    {isCheckedIn
                      ? 'ĐÃ CHECK-IN TẠI CỬA'
                      : isCancelled
                      ? 'ĐÃ HỦY ĐẶT PHÒNG'
                      : 'SẴN SÀNG CHECK-IN'}
                  </Text>
                </View>

                <Text style={styles.qrHint}>
                  {isCheckedIn
                    ? 'Phiên học đang diễn ra. Chúc nhóm học tập hiệu quả!'
                    : 'Đưa mã QR này trước camera cửa phòng hoặc máy quét'}
                </Text>
              </View>

              {/* Ticket Details */}
              <View style={styles.ticketDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>NGÀY ĐẶT</Text>
                    <Text style={styles.detailValue}>
                      {formatDisplayDate(booking.date)}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>KHUNG GIỜ</Text>
                    <Text style={[styles.detailValue, { color: '#1D4ED8' }]}>
                      {booking.slotStartTime} - {booking.slotEndTime}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>SINH VIÊN ĐẶT</Text>
                    <Text style={styles.detailValue}>{booking.studentName}</Text>
                    <Text style={styles.detailSub}>{booking.studentId}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>SỐ LƯỢNG</Text>
                    <Text style={styles.detailValue}>
                      {booking.groupSize} thành viên
                    </Text>
                  </View>
                </View>

                <View style={styles.purposeBox}>
                  <Text style={styles.detailLabel}>MỤC ĐÍCH SỬ DỤNG</Text>
                  <Text style={styles.purposeText}>{booking.purpose}</Text>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actionButtons}>
              {!isCheckedIn && !isCancelled && (
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    isCheckingIn && { opacity: 0.7 },
                  ]}
                  onPress={handleSimulateCheckIn}
                  disabled={isCheckingIn}
                >
                  <Ionicons name="scan-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.primaryBtnText}>
                    {isCheckingIn ? 'Đang xác thực...' : 'Quét mô phỏng Check-in'}
                  </Text>
                </TouchableOpacity>
              )}

              {!isCancelled && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleCancelBooking}
                >
                  <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  <Text style={styles.cancelBtnText}>Hủy ca đặt này</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vkuLogoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vkuLogoText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  scrollContent: {
    padding: 20,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  ticketTop: {
    backgroundColor: '#1E40AF',
    padding: 20,
    alignItems: 'center',
  },
  roomCodeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  roomNameText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  bookingCodeText: {
    color: '#BFDBFE',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  dashedDividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  halfCircleLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    marginLeft: -10,
  },
  halfCircleRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    marginRight: -10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    marginHorizontal: 10,
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  qrWrapper: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 14,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 8,
  },
  statusPillSuccess: {
    backgroundColor: '#ECFDF5',
  },
  statusPillCancelled: {
    backgroundColor: '#FEF2F2',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  statusPillTextSuccess: {
    color: '#059669',
  },
  statusPillTextCancelled: {
    color: '#DC2626',
  },
  qrHint: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    maxWidth: 240,
  },
  ticketDetails: {
    padding: 20,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  detailSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  purposeBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  purposeText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  actionButtons: {
    marginTop: 20,
    gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#1E40AF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 2,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  cancelBtnText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
});
