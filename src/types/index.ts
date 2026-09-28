export type BuildingCode = 'A' | 'B' | 'C' | 'V';

export type RoomType = 'computer_lab' | 'study_group' | 'conference' | 'quiet_zone';

export type EquipmentType = 
  | 'projector' 
  | 'whiteboard' 
  | 'high_spec_pc' 
  | 'air_conditioner' 
  | 'power_outlets' 
  | 'wifi_6';

export interface Room {
  id: string;
  name: string;
  code: string;
  building: BuildingCode;
  floor: number;
  roomNumber: string;
  capacity: number;
  type: RoomType;
  image: string;
  gallery: string[];
  equipment: EquipmentType[];
  description: string;
  rules: string[];
  specs?: {
    pcCount?: number;
    pcSpecs?: string;
    screenSize?: string;
  };
}

export interface TimeSlot {
  id: string;
  startTime: string; // '07:30'
  endTime: string;   // '09:30'
  label: string;     // 'Ca 1 (07:30 - 09:30)'
  period: 'morning' | 'afternoon' | 'evening';
}

export type BookingStatus = 'confirmed' | 'checked_in' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  bookingCode: string; // e.g. VKU-RES-8429
  roomId: string;
  roomName: string;
  building: BuildingCode;
  roomNumber: string;
  roomImage: string;
  date: string; // 'YYYY-MM-DD'
  slotId: string;
  slotStartTime: string;
  slotEndTime: string;
  studentId: string;
  studentName: string;
  purpose: string;
  groupSize: number;
  status: BookingStatus;
  notificationId?: string;
  createdAt: string;
  qrPayload: string;
}

export interface StudentUser {
  id: string;
  studentId: string;
  fullName: string;
  email: string;
  major: string;
  cohort: string;
  avatar: string;
}

export type CapacityFilter = 'ALL' | 'small' | 'medium' | 'large';

export interface RoomFilterState {
  searchQuery: string;
  building: 'ALL' | BuildingCode;
  capacity: CapacityFilter;
  equipments: EquipmentType[];
  onlyAvailableNow: boolean;
}
