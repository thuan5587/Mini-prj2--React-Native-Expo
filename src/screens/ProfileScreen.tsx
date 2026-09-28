import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBookingStore } from '../store/useBookingStore';
import { triggerInstantDemoNotification } from '../services/notificationService';

export function ProfileScreen() {
  const user = useBookingStore((s) => s.user);
  const bookings = useBookingStore((s) => s.bookings);
  const resetToMockData = useBookingStore((s) => s.resetToMockData);

  const studentBookings = bookings.filter((b) => b.studentId === user.studentId);
  const activeBookings = studentBookings.filter((b) => b.status === 'confirmed');
  const checkedInBookings = studentBookings.filter((b) => b.status === 'checked_in');

  const handleTestNotification = async () => {
    await triggerInstantDemoNotification(
      'Phòng Lab AI V.402',
      '13:00 - 15:00'
    );
    Alert.alert(
      '🔔 Đã gửi thông báo thử nghiệm',
      'Thông báo nhắc nhở 15 phút trước ca học đã được kích hoạt. Hãy kiểm tra thanh thông báo thiết bị của bạn!'
    );
  };

  const handleResetData = () => {
    Alert.alert(
      'Khôi phục dữ liệu mẫu ban đầu',
      'Thao tác này sẽ làm mới danh sách phòng và các ca đặt mẫu ban đầu để kiểm thử xung đột thời gian thực.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục ngay',
          style: 'destructive',
          onPress: () => {
            resetToMockData();
            Alert.alert('Thành công', 'Đã khôi phục dữ liệu mẫu ban đầu!');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F294A" />

      {/* Screen Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ Sơ Sinh Viên VKU</Text>
        <Text style={styles.headerSubtitle}>
          Tài khoản sinh viên & Cài đặt hệ thống đặt phòng
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Digital Student ID Card */}
        <View style={styles.idCard}>
          <View style={styles.idCardHeader}>
            <View style={styles.vkuLogoWrap}>
              <Ionicons name="school" size={18} color="#FFFFFF" />
              <Text style={styles.vkuCardTitle}>TRƯỜNG ĐẠI HỌC CNTT & TRUYỀN THÔNG VIỆT - HÀN</Text>
            </View>
          </View>

          <View style={styles.idCardBody}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.idCardDetails}>
              <Text style={styles.studentName}>{user.fullName}</Text>
              <Text style={styles.studentIdLabel}>MSSV: <Text style={styles.studentIdVal}>{user.studentId}</Text></Text>
              <Text style={styles.studentMajor}>{user.major}</Text>
              <Text style={styles.studentCohort}>{user.cohort}</Text>
            </View>
          </View>

          <View style={styles.idCardFooter}>
            <Ionicons name="mail-outline" size={13} color="#93C5FD" />
            <Text style={styles.emailText}>{user.email}</Text>
          </View>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Thống kê giữ chỗ</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{studentBookings.length}</Text>
            <Text style={styles.statLabel}>Tổng ca đã đặt</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#1D4ED8' }]}>{activeBookings.length}</Text>
            <Text style={styles.statLabel}>Sắp diễn ra</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#059669' }]}>{checkedInBookings.length}</Text>
            <Text style={styles.statLabel}>Đã check-in</Text>
          </View>
        </View>

        {/* Features / Actions */}
        <Text style={styles.sectionTitle}>Tiện ích kiểm thử & Cài đặt</Text>
        <View style={styles.actionMenu}>
          {/* Notification Test */}
          <TouchableOpacity style={styles.menuItem} onPress={handleTestNotification}>
            <View style={[styles.menuIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="notifications-outline" size={20} color="#1D4ED8" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuTitle}>Thử nghiệm Thông báo Nhắc nhở</Text>
              <Text style={styles.menuSub}>
                Mô phỏng chuông thông báo 15 phút trước ca học (expo-notifications)
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* Reset Demo Data */}
          <TouchableOpacity style={styles.menuItem} onPress={handleResetData}>
            <View style={[styles.menuIconWrap, { backgroundColor: '#FEF2F2' }]}>
              <Ionicons name="refresh-outline" size={20} color="#DC2626" />
            </View>
            <View style={styles.menuInfo}>
              <Text style={[styles.menuTitle, { color: '#DC2626' }]}>
                Khôi phục dữ liệu mẫu ban đầu
              </Text>
              <Text style={styles.menuSub}>
                Xóa cache và thiết lập lại các ca đặt phòng demo
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Campus Information */}
        <View style={styles.infoBox}>
          <Ionicons name="business" size={18} color="#1D4ED8" />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoBoxTitle}>Cơ sở đào tạo VKU</Text>
            <Text style={styles.infoBoxDesc}>
              470 Đường Trần Đại Nghĩa, Khu Đô thị Đại học Đà Nẵng, P. Hòa Quý, Q. Ngũ Hành Sơn, TP. Đà Nẵng.
            </Text>
            <Text style={styles.infoBoxContact}>Hỗ trợ kỹ thuật: phongcntt@vku.udn.vn</Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  idCard: {
    backgroundColor: '#1E40AF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  idCardHeader: {
    backgroundColor: '#172554',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  vkuLogoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  vkuCardTitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    flex: 1,
  },
  idCardBody: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#93C5FD',
    backgroundColor: '#CBD5E1',
  },
  idCardDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  studentIdLabel: {
    fontSize: 13,
    color: '#BFDBFE',
    marginBottom: 4,
  },
  studentIdVal: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  studentMajor: {
    fontSize: 12,
    color: '#E0E7FF',
    marginBottom: 2,
  },
  studentCohort: {
    fontSize: 11,
    color: '#93C5FD',
  },
  idCardFooter: {
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emailText: {
    fontSize: 12,
    color: '#BFDBFE',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statNum: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  actionMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  menuSub: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  infoBoxDesc: {
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 16,
    marginBottom: 4,
  },
  infoBoxContact: {
    fontSize: 11,
    color: '#1E40AF',
    fontWeight: '600',
  },
});
