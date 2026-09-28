import { TimeSlot } from '../types';

export const TIME_SLOTS: TimeSlot[] = [
  {
    id: 'slot-1',
    startTime: '07:30',
    endTime: '09:30',
    label: '07:30 - 09:30',
    period: 'morning',
  },
  {
    id: 'slot-2',
    startTime: '09:30',
    endTime: '11:30',
    label: '09:30 - 11:30',
    period: 'morning',
  },
  {
    id: 'slot-3',
    startTime: '13:00',
    endTime: '15:00',
    label: '13:00 - 15:00',
    period: 'afternoon',
  },
  {
    id: 'slot-4',
    startTime: '15:00',
    endTime: '17:00',
    label: '15:00 - 17:00',
    period: 'afternoon',
  },
  {
    id: 'slot-5',
    startTime: '17:30',
    endTime: '19:30',
    label: '17:30 - 19:30',
    period: 'evening',
  },
];

export interface DayOption {
  date: string; // 'YYYY-MM-DD'
  dayOfWeek: string; // 'Th 2', 'Th 3', etc.
  dayNumber: string; // '28'
  monthStr: string; // 'Tháng 9'
  isToday: boolean;
  fullDate: Date;
}

const VI_DAYS = ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'];

export function getUpcoming7Days(): DayOption[] {
  const days: DayOption[] = [];
  const now = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    days.push({
      date: dateStr,
      dayOfWeek: VI_DAYS[d.getDay()],
      dayNumber: String(d.getDate()),
      monthStr: `Th${d.getMonth() + 1}`,
      isToday: i === 0,
      fullDate: d,
    });
  }

  return days;
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayName = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][date.getDay()];
  return `${dayName}, ${d < 10 ? '0' + d : d}/${m < 10 ? '0' + m : m}/${y}`;
}

export function isSlotPastForToday(dateStr: string, slotEndTime: string): boolean {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  if (dateStr !== todayStr) return false;

  const [endHour, endMinute] = slotEndTime.split(':').map(Number);
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (currentHour > endHour) return true;
  if (currentHour === endHour && currentMinute >= endMinute) return true;
  return false;
}

export function isSlotActiveNow(dateStr: string, slotStartTime: string, slotEndTime: string): boolean {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  if (dateStr !== todayStr) return false;

  const [startHour, startMinute] = slotStartTime.split(':').map(Number);
  const [endHour, endMinute] = slotEndTime.split(':').map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateBookingCode(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `VKU-RES-${random}`;
}
