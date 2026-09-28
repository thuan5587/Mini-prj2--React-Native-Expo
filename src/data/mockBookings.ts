import { Booking } from '../types';
import { getTodayDateString } from '../utils/dateUtils';

const today = getTodayDateString();

// Tomorrow's date
const tomorrowObj = new Date();
tomorrowObj.setDate(tomorrowObj.getDate() + 1);
const tomorrow = `${tomorrowObj.getFullYear()}-${String(tomorrowObj.getMonth() + 1).padStart(2, '0')}-${String(tomorrowObj.getDate()).padStart(2, '0')}`;

export const INITIAL_BOOKINGS: Booking[] = [
  // 1. Current student's active booking for today (Ca 3: 13:00 - 15:00)
  {
    id: 'res-vku-101',
    bookingCode: 'VKU-RES-8429',
    roomId: 'room-c-205',
    roomName: 'Phòng Thảo Luận Nhóm Sáng Tạo C.205',
    building: 'C',
    roomNumber: 'C-205',
    roomImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    date: today,
    slotId: 'slot-3',
    slotStartTime: '13:00',
    slotEndTime: '15:00',
    studentId: '22IT045',
    studentName: 'Nguyễn Thanh Thuận',
    purpose: 'Họp nhóm Capstone dự án Di Động Đa Nền Tảng',
    groupSize: 5,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    qrPayload: JSON.stringify({
      code: 'VKU-RES-8429',
      room: 'C-205',
      date: today,
      slot: '13:00 - 15:00',
      studentId: '22IT045',
    }),
  },
  // 2. Conflict demo: Another group booked room-v-402 on slot-2 today
  {
    id: 'res-conflict-01',
    bookingCode: 'VKU-RES-3190',
    roomId: 'room-v-402',
    roomName: 'Phòng Lab AI & Robotics V.402',
    building: 'V',
    roomNumber: 'V-402',
    roomImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    date: today,
    slotId: 'slot-2',
    slotStartTime: '09:30',
    slotEndTime: '11:30',
    studentId: '21IT089',
    studentName: 'Trần Văn Minh',
    purpose: 'Thực hành huấn luyện mô hình YOLOv11',
    groupSize: 8,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    qrPayload: JSON.stringify({
      code: 'VKU-RES-3190',
      room: 'V-402',
      date: today,
      slot: '09:30 - 11:30',
      studentId: '21IT089',
    }),
  },
  // 3. Conflict demo: Another group booked room-v-402 on slot-4 today
  {
    id: 'res-conflict-02',
    bookingCode: 'VKU-RES-7721',
    roomId: 'room-v-402',
    roomName: 'Phòng Lab AI & Robotics V.402',
    building: 'V',
    roomNumber: 'V-402',
    roomImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    date: today,
    slotId: 'slot-4',
    slotStartTime: '15:00',
    slotEndTime: '17:00',
    studentId: '20IT112',
    studentName: 'Lê Hoàng Long',
    purpose: 'Nghiên cứu thị giác máy tính xe tự hành',
    groupSize: 12,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    qrPayload: JSON.stringify({
      code: 'VKU-RES-7721',
      room: 'V-402',
      date: today,
      slot: '15:00 - 17:00',
      studentId: '20IT112',
    }),
  },
  // 4. Booking for tomorrow
  {
    id: 'res-vku-102',
    bookingCode: 'VKU-RES-9932',
    roomId: 'room-b-301',
    roomName: 'Computer Lab Software Lab B.301',
    building: 'B',
    roomNumber: 'B-301',
    roomImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    date: tomorrow,
    slotId: 'slot-1',
    slotStartTime: '07:30',
    slotEndTime: '09:30',
    studentId: '22IT045',
    studentName: 'Nguyễn Thanh Thuận',
    purpose: 'Luyện đề thi Olympic Tin học Sinh viên',
    groupSize: 4,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    qrPayload: JSON.stringify({
      code: 'VKU-RES-9932',
      room: 'B-301',
      date: tomorrow,
      slot: '07:30 - 09:30',
      studentId: '22IT045',
    }),
  },
];
