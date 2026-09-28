import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Room, 
  Booking, 
  StudentUser, 
  RoomFilterState, 
  EquipmentType, 
  BuildingCode, 
  CapacityFilter 
} from '../types';
import { MOCK_ROOMS, CURRENT_STUDENT } from '../data/mockRooms';
import { INITIAL_BOOKINGS } from '../data/mockBookings';
import { 
  generateBookingCode, 
  getTodayDateString, 
  TIME_SLOTS, 
  isSlotActiveNow 
} from '../utils/dateUtils';
import { scheduleBookingReminder, cancelBookingReminder } from '../services/notificationService';

interface CreateBookingParams {
  roomId: string;
  roomName: string;
  building: BuildingCode;
  roomNumber: string;
  roomImage: string;
  date: string;
  slotId: string;
  slotStartTime: string;
  slotEndTime: string;
  purpose: string;
  groupSize: number;
}

interface BookingState {
  // User Session
  user: StudentUser;
  setUser: (user: StudentUser) => void;

  // Rooms
  rooms: Room[];

  // Bookings State
  bookings: Booking[];
  isSlotBooked: (roomId: string, date: string, slotId: string) => boolean;
  getBookingForSlot: (roomId: string, date: string, slotId: string) => Booking | undefined;
  isRoomAvailableNow: (roomId: string) => boolean;

  // Actions
  createBooking: (params: CreateBookingParams) => Promise<{ success: boolean; booking?: Booking; error?: string }>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  checkInBooking: (bookingId: string) => boolean;
  resetToMockData: () => void;

  // Filters State
  filters: RoomFilterState;
  setSearchQuery: (query: string) => void;
  setBuildingFilter: (building: 'ALL' | BuildingCode) => void;
  setCapacityFilter: (capacity: CapacityFilter) => void;
  toggleEquipmentFilter: (equipment: EquipmentType) => void;
  setOnlyAvailableNow: (onlyAvailable: boolean) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: RoomFilterState = {
  searchQuery: '',
  building: 'ALL',
  capacity: 'ALL',
  equipments: [],
  onlyAvailableNow: false,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      user: CURRENT_STUDENT,
      setUser: (user) => set({ user }),

      rooms: MOCK_ROOMS,
      bookings: INITIAL_BOOKINGS,

      isSlotBooked: (roomId: string, date: string, slotId: string) => {
        const bookings = get().bookings;
        return bookings.some(
          (b) =>
            b.roomId === roomId &&
            b.date === date &&
            b.slotId === slotId &&
            b.status !== 'cancelled'
        );
      },

      getBookingForSlot: (roomId: string, date: string, slotId: string) => {
        const bookings = get().bookings;
        return bookings.find(
          (b) =>
            b.roomId === roomId &&
            b.date === date &&
            b.slotId === slotId &&
            b.status !== 'cancelled'
        );
      },

      isRoomAvailableNow: (roomId: string) => {
        const todayStr = getTodayDateString();
        // Find if current time matches any of our discrete slots
        const activeSlot = TIME_SLOTS.find((s) => isSlotActiveNow(todayStr, s.startTime, s.endTime));
        
        // If outside active slot hours, consider available for booking
        if (!activeSlot) return true;

        // Check if room is booked in this active slot
        const isBooked = get().isSlotBooked(roomId, todayStr, activeSlot.id);
        return !isBooked;
      },

      createBooking: async (params: CreateBookingParams) => {
        const { isSlotBooked, user } = get();

        // Conflict check
        if (isSlotBooked(params.roomId, params.date, params.slotId)) {
          return {
            success: false,
            error: 'Khung giờ này vừa có người đặt hoặc đã bị chiếm dụng. Vui lòng chọn ca khác!',
          };
        }

        const bookingCode = generateBookingCode();
        const id = `res-${Date.now()}`;
        const createdAt = new Date().toISOString();

        const qrPayload = JSON.stringify({
          code: bookingCode,
          roomId: params.roomId,
          room: params.roomNumber,
          date: params.date,
          slot: `${params.slotStartTime} - ${params.slotEndTime}`,
          studentId: user.studentId,
          studentName: user.fullName,
        });

        const newBooking: Booking = {
          id,
          bookingCode,
          roomId: params.roomId,
          roomName: params.roomName,
          building: params.building,
          roomNumber: params.roomNumber,
          roomImage: params.roomImage,
          date: params.date,
          slotId: params.slotId,
          slotStartTime: params.slotStartTime,
          slotEndTime: params.slotEndTime,
          studentId: user.studentId,
          studentName: user.fullName,
          purpose: params.purpose.trim() || 'Học tập & Thảo luận nhóm',
          groupSize: params.groupSize || 2,
          status: 'confirmed',
          createdAt,
          qrPayload,
        };

        // Schedule local notification 15 minutes before slot
        const notificationId = await scheduleBookingReminder(newBooking);
        if (notificationId) {
          newBooking.notificationId = notificationId;
        }

        set((state) => ({
          bookings: [newBooking, ...state.bookings],
        }));

        return { success: true, booking: newBooking };
      },

      cancelBooking: async (bookingId: string) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking) return false;

        if (booking.notificationId) {
          await cancelBookingReminder(booking.notificationId);
        }

        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
          ),
        }));

        return true;
      },

      checkInBooking: (bookingId: string) => {
        const booking = get().bookings.find((b) => b.id === bookingId);
        if (!booking || booking.status === 'cancelled') return false;

        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: 'checked_in' as const } : b
          ),
        }));

        return true;
      },

      resetToMockData: () => {
        set({
          user: CURRENT_STUDENT,
          bookings: INITIAL_BOOKINGS,
          filters: DEFAULT_FILTERS,
        });
      },

      // Filters
      filters: DEFAULT_FILTERS,

      setSearchQuery: (query: string) =>
        set((state) => ({
          filters: { ...state.filters, searchQuery: query },
        })),

      setBuildingFilter: (building: 'ALL' | BuildingCode) =>
        set((state) => ({
          filters: { ...state.filters, building },
        })),

      setCapacityFilter: (capacity: CapacityFilter) =>
        set((state) => ({
          filters: { ...state.filters, capacity },
        })),

      toggleEquipmentFilter: (equipment: EquipmentType) =>
        set((state) => {
          const exists = state.filters.equipments.includes(equipment);
          const newEquipments = exists
            ? state.filters.equipments.filter((e) => e !== equipment)
            : [...state.filters.equipments, equipment];
          return {
            filters: { ...state.filters, equipments: newEquipments },
          };
        }),

      setOnlyAvailableNow: (onlyAvailableNow: boolean) =>
        set((state) => ({
          filters: { ...state.filters, onlyAvailableNow },
        })),

      resetFilters: () =>
        set({
          filters: DEFAULT_FILTERS,
        }),
    }),
    {
      name: 'vku-booking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        bookings: state.bookings,
        user: state.user,
      }),
    }
  )
);
