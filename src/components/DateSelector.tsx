import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DayOption, getUpcoming7Days } from '../utils/dateUtils';

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const days: DayOption[] = useMemo(() => getUpcoming7Days(), []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Chọn ngày đặt (7 ngày tới)</Text>
        <Text style={styles.headerSubtitle}>
          {days.find((d) => d.date === selectedDate)?.monthStr || ''}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollList}
      >
        {days.map((item) => {
          const isSelected = item.date === selectedDate;

          return (
            <TouchableOpacity
              key={item.date}
              style={[
                styles.dayCard,
                isSelected && styles.dayCardSelected,
                item.isToday && !isSelected && styles.dayCardToday,
              ]}
              onPress={() => onSelectDate(item.date)}
              activeOpacity={0.7}
            >
              {item.isToday && (
                <View
                  style={[
                    styles.todayBadge,
                    isSelected && styles.todayBadgeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.todayBadgeText,
                      isSelected && styles.todayBadgeTextSelected,
                    ]}
                  >
                    Hôm nay
                  </Text>
                </View>
              )}

              <Text
                style={[
                  styles.dayOfWeekText,
                  isSelected && styles.dayOfWeekTextSelected,
                ]}
              >
                {item.dayOfWeek}
              </Text>

              <Text
                style={[
                  styles.dayNumberText,
                  isSelected && styles.dayNumberTextSelected,
                ]}
              >
                {item.dayNumber}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayCard: {
    width: 62,
    height: 82,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  dayCardSelected: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
    elevation: 3,
    shadowColor: '#1E40AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  dayCardToday: {
    borderColor: '#93C5FD',
    backgroundColor: '#F8FAFC',
  },
  todayBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginBottom: 4,
  },
  todayBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  todayBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E40AF',
  },
  todayBadgeTextSelected: {
    color: '#FFFFFF',
  },
  dayOfWeekText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
  },
  dayOfWeekTextSelected: {
    color: '#E0E7FF',
  },
  dayNumberText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  dayNumberTextSelected: {
    color: '#FFFFFF',
  },
});
