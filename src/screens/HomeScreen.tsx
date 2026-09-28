import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { Room } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import { RoomCard } from '../components/RoomCard';
import { FilterSection } from '../components/FilterSection';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const rooms = useBookingStore((s) => s.rooms);
  const filters = useBookingStore((s) => s.filters);
  const user = useBookingStore((s) => s.user);
  const isRoomAvailableNow = useBookingStore((s) => s.isRoomAvailableNow);
  const resetFilters = useBookingStore((s) => s.resetFilters);

  // Filtered rooms based on multi-parameter filter
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 1. Search Query
      if (filters.searchQuery.trim() !== '') {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchName = room.name.toLowerCase().includes(q);
        const matchNumber = room.roomNumber.toLowerCase().includes(q);
        const matchCode = room.code.toLowerCase().includes(q);
        const matchBuilding = `khu ${room.building.toLowerCase()}`.includes(q);
        if (!matchName && !matchNumber && !matchCode && !matchBuilding) {
          return false;
        }
      }

      // 2. Building
      if (filters.building !== 'ALL' && room.building !== filters.building) {
        return false;
      }

      // 3. Capacity Range
      if (filters.capacity === 'small' && (room.capacity < 2 || room.capacity > 4)) {
        return false;
      }
      if (filters.capacity === 'medium' && (room.capacity < 5 || room.capacity > 10)) {
        return false;
      }
      if (filters.capacity === 'large' && room.capacity < 11) {
        return false;
      }

      // 4. Equipments (must contain all selected equipments)
      if (filters.equipments.length > 0) {
        const hasAllEquipments = filters.equipments.every((eq) =>
          room.equipment.includes(eq)
        );
        if (!hasAllEquipments) return false;
      }

      // 5. Only Available Now
      if (filters.onlyAvailableNow) {
        const available = isRoomAvailableNow(room.id);
        if (!available) return false;
      }

      return true;
    });
  }, [rooms, filters, isRoomAvailableNow]);

  const handleRoomPress = useCallback(
    (room: Room) => {
      navigation.navigate('RoomDetail', { room });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: { item: Room }) => {
      const isAvailable = isRoomAvailableNow(item.id);
      return (
        <RoomCard
          room={item}
          isAvailableNow={isAvailable}
          onPress={handleRoomPress}
        />
      );
    },
    [isRoomAvailableNow, handleRoomPress]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F294A" />

      {/* Top University Campus Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <View style={styles.badgeRow}>
              <View style={styles.campusBadge}>
                <Ionicons name="location" size={11} color="#60A5FA" />
                <Text style={styles.campusBadgeText}>VKU • CS Nam Kỳ Khởi Nghĩa</Text>
              </View>
            </View>
            <Text style={styles.greetingText}>
              Xin chào, {user.fullName.split(' ').slice(-1)[0]} 👋
            </Text>
            <Text style={styles.subGreetingText}>
              Tra cứu & Giữ chỗ phòng tự học, máy tính Lab
            </Text>
          </View>

          <View style={styles.studentBadge}>
            <Text style={styles.studentBadgeId}>{user.studentId}</Text>
          </View>
        </View>
      </View>

      {/* Filter Section: Search bar, building chips, equipment filters */}
      <FilterSection />

      {/* Result Count and FlatList */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.resultCountText}>
          Tìm thấy <Text style={styles.resultCountBold}>{filteredRooms.length}</Text> phòng học & Lab
        </Text>
      </View>

      {/* High-Performance 60fps FlatList */}
      <FlatList
        data={filteredRooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        // Optimization props for 60fps scrolling
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews={Platform.OS === 'android'}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
            <Text style={styles.emptySubtitle}>
              Thử xóa bớt bộ lọc hoặc tìm kiếm theo từ khóa khác.
            </Text>
            <TouchableOpacity style={styles.resetFilterBtn} onPress={resetFilters}>
              <Text style={styles.resetFilterBtnText}>Đặt lại bộ lọc</Text>
            </TouchableOpacity>
          </View>
        }
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  campusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  campusBadgeText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '600',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  subGreetingText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  studentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  studentBadgeId: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  listHeaderRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resultCountText: {
    fontSize: 13,
    color: '#64748B',
  },
  resultCountBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  resetFilterBtn: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetFilterBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
