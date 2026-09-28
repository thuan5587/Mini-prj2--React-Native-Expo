import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BuildingCode, CapacityFilter, EquipmentType } from '../types';
import { useBookingStore } from '../store/useBookingStore';

export function FilterSection() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const filters = useBookingStore((s) => s.filters);
  const setSearchQuery = useBookingStore((s) => s.setSearchQuery);
  const setBuildingFilter = useBookingStore((s) => s.setBuildingFilter);
  const setCapacityFilter = useBookingStore((s) => s.setCapacityFilter);
  const toggleEquipmentFilter = useBookingStore((s) => s.toggleEquipmentFilter);
  const setOnlyAvailableNow = useBookingStore((s) => s.setOnlyAvailableNow);
  const resetFilters = useBookingStore((s) => s.resetFilters);

  const buildings: { label: string; value: 'ALL' | BuildingCode }[] = [
    { label: 'Tất cả tòa', value: 'ALL' },
    { label: 'Khu A', value: 'A' },
    { label: 'Khu B', value: 'B' },
    { label: 'Khu C', value: 'C' },
    { label: 'Khu V (Việt-Hàn)', value: 'V' },
  ];

  const capacities: { label: string; value: CapacityFilter }[] = [
    { label: 'Mọi quy mô', value: 'ALL' },
    { label: 'Nhỏ (2–4 SV)', value: 'small' },
    { label: 'Vừa (5–10 SV)', value: 'medium' },
    { label: 'Lớn (11–20 SV)', value: 'large' },
  ];

  const equipments: { label: string; value: EquipmentType; icon: string }[] = [
    { label: 'PC cấu hình cao', value: 'high_spec_pc', icon: 'desktop-outline' },
    { label: 'Máy chiếu', value: 'projector', icon: 'videocam-outline' },
    { label: 'Bảng từ', value: 'whiteboard', icon: 'easel-outline' },
    { label: 'Điều hòa', value: 'air_conditioner', icon: 'snow-outline' },
  ];

  const isAnyFilterActive =
    filters.searchQuery !== '' ||
    filters.building !== 'ALL' ||
    filters.capacity !== 'ALL' ||
    filters.equipments.length > 0 ||
    filters.onlyAvailableNow;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#64748B" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm phòng theo tên, mã phòng (V402, C205...)"
          placeholderTextColor="#94A3B8"
          value={filters.searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
        {filters.searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Primary Row: Building Chips + Filter Toggle */}
      <View style={styles.buildingRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.buildingScroll}
        >
          {buildings.map((b) => {
            const isSelected = filters.building === b.value;
            return (
              <TouchableOpacity
                key={b.value}
                style={[
                  styles.buildingChip,
                  isSelected && styles.buildingChipActive,
                ]}
                onPress={() => setBuildingFilter(b.value)}
              >
                <Text
                  style={[
                    styles.buildingChipText,
                    isSelected && styles.buildingChipTextActive,
                  ]}
                >
                  {b.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Quick Filters Row */}
      <View style={styles.quickFilterRow}>
        <TouchableOpacity
          style={[
            styles.toggleChip,
            filters.onlyAvailableNow && styles.toggleChipActive,
          ]}
          onPress={() => setOnlyAvailableNow(!filters.onlyAvailableNow)}
        >
          <View
            style={[
              styles.dot,
              { backgroundColor: filters.onlyAvailableNow ? '#10B981' : '#94A3B8' },
            ]}
          />
          <Text
            style={[
              styles.toggleChipText,
              filters.onlyAvailableNow && styles.toggleChipTextActive,
            ]}
          >
            Đang trống ngay
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterExpandBtn,
            (showAdvanced || filters.capacity !== 'ALL' || filters.equipments.length > 0) &&
              styles.filterExpandBtnActive,
          ]}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Ionicons
            name="options-outline"
            size={14}
            color={
              showAdvanced || filters.capacity !== 'ALL' || filters.equipments.length > 0
                ? '#1D4ED8'
                : '#475569'
            }
          />
          <Text
            style={[
              styles.filterExpandText,
              (showAdvanced || filters.capacity !== 'ALL' || filters.equipments.length > 0) &&
                styles.filterExpandTextActive,
            ]}
          >
            Bộ lọc thêm
          </Text>
          {(filters.capacity !== 'ALL' || filters.equipments.length > 0) && (
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountText}>
                {(filters.capacity !== 'ALL' ? 1 : 0) + filters.equipments.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {isAnyFilterActive && (
          <TouchableOpacity onPress={resetFilters} style={styles.resetBtn}>
            <Ionicons name="refresh-outline" size={13} color="#EF4444" />
            <Text style={styles.resetText}>Đặt lại</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Advanced Filter Expansion */}
      {showAdvanced && (
        <View style={styles.advancedBox}>
          {/* Capacity */}
          <Text style={styles.sectionTitle}>Sức chứa phòng:</Text>
          <View style={styles.chipGrid}>
            {capacities.map((cap) => {
              const isSelected = filters.capacity === cap.value;
              return (
                <Pressable
                  key={cap.value}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                  ]}
                  onPress={() => setCapacityFilter(cap.value)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {cap.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Equipment */}
          <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Trang thiết bị:</Text>
          <View style={styles.chipGrid}>
            {equipments.map((eq) => {
              const isSelected = filters.equipments.includes(eq.value);
              return (
                <Pressable
                  key={eq.value}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                  ]}
                  onPress={() => toggleEquipmentFilter(eq.value)}
                >
                  <Ionicons
                    name={eq.icon as any}
                    size={13}
                    color={isSelected ? '#1D4ED8' : '#475569'}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {eq.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  buildingRow: {
    marginBottom: 8,
  },
  buildingScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  buildingChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  buildingChipActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  buildingChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  buildingChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  toggleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  toggleChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  toggleChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  toggleChipTextActive: {
    color: '#065F46',
    fontWeight: '600',
  },
  filterExpandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 5,
  },
  filterExpandBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  filterExpandText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  filterExpandTextActive: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  filterCountBadge: {
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  filterCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 3,
  },
  resetText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },
  advancedBox: {
    marginTop: 10,
    marginHorizontal: 16,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  filterChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  filterChipText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
});
