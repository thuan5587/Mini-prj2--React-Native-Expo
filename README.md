# VKU StudyRoom - Real-time Study Room Booking App
> **Mini-Project #2**: Real-time Study Room Booking App (React Native & Expo)  
> **Trường**: Trường Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU), ĐHĐN  
> **Trọng số điểm**: 10% (Tuần 5 - 6)  
> **Công nghệ**: React Native, Expo SDK 57, TypeScript, Zustand, React Navigation, Expo Notifications.

---

## 🎯 Tổng quan Đề tài & Mục tiêu Đạt được
Ứng dụng di động dành cho sinh viên VKU giúp tra cứu trạng thái phòng học theo thời gian thực và đặt chỗ phòng tự học nhóm, phòng Lab máy tính cấu hình cao tại các tòa nhà khu A, B, C, V mà không lo trùng lịch (conflict) hay phải đến tận cửa kiểm tra.

### ✅ Các Tiêu chí Kỹ thuật Đạt chuẩn 100%:
1. **Room Discovery & Multi-Parameter Filter**:
   - Danh sách phòng tối ưu **FlatList 60fps** (`initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `React.memo(RoomCard)`).
   - Hiển thị hình ảnh phòng trực quan, tòa nhà / tầng (`Khu V • Tầng 4`), sức chứa (`18 chỗ`), trạng thái thời gian thực (`Trống ngay` vs `Đang có người`).
   - Bộ lọc đa tiêu chí tức thì:
     - **Tòa nhà**: Tất cả, Khu A, Khu B, Khu C, Khu V.
     - **Sức chứa**: Nhỏ (2–4 SV), Vừa (5–10 SV), Lớn (11–20 SV).
     - **Trang thiết bị**: Máy tính cấu hình cao (High-spec PC), Máy chiếu (Projector), Bảng từ (Whiteboard), Điều hòa (AC).
     - **Tìm kiếm theo tên / số phòng**: Tức thì (V402, C205, Lab AI...).
2. **Interactive Time-Slot Selector & Conflict Engine**:
   - Bộ chọn ngày trượt ngang 7 ngày liên tiếp (`DateSelector`).
   - 5 ca học cố định 2 giờ mỗi ngày (`07:30–09:30`, `09:30–11:30`, `13:00–15:00`, `15:00–17:00`, `17:30–19:30`).
   - **Cơ chế chống xung đột (Conflict Engine)**: Những ca đã có người đặt trên ngày đã chọn sẽ được hiển thị đỏ (`Đã đặt`), khóa nút chọn và hiển thị tên người đã giữ chỗ.
   - Vô hiệu hóa tự động các ca đã qua giờ trong ngày hiện tại.
   - Tạo **Thẻ điện tử Smart Pass** tích hợp **Mã QR tương tác** (`react-native-qrcode-svg`) hỗ trợ mô phỏng Check-in tại cửa và Hủy phòng.
3. **Global State Management with Zustand (`useBookingStore`)**:
   - Quản lý phiên sinh viên VKU (`StudentUser`: họ tên, MSSV, lớp, email sinh viên).
   - Quản lý danh sách đặt chỗ, xung đột ca, hành động hủy phòng và check-in.
   - Lưu trữ bền vững dữ liệu trên thiết bị với `@react-native-async-storage/async-storage`.
4. **Local Notifications (`expo-notifications`)**:
   - Tự động lên lịch thông báo nhắc nhở sinh viên **15 phút trước khi ca học bắt đầu**.
   - Hủy thông báo tương ứng khi sinh viên hủy đặt phòng.
   - Nút kiểm tra âm báo / banner tức thì trong màn hình Hồ sơ Sinh viên.

---

## 📁 Cấu trúc Thư mục Dự án

```text
React Native & Expo/
├── App.tsx                    # Entry point với SafeAreaProvider & Notifications listeners
├── app.json                   # Cấu hình Expo, plugin expo-notifications & VKU scheme
├── package.json               # Dependencies chuẩn SDK 57 & npm scripts
├── tsconfig.json              # TypeScript strict configuration
└── src/
    ├── types/
    │   └── index.ts           # Type definitions (Room, Booking, TimeSlot, Filters, User)
    ├── data/
    │   ├── mockRooms.ts       # Dữ liệu phòng học các khu A, B, C, V trường VKU
    │   └── mockBookings.ts    # Dữ liệu ca đặt ban đầu minh họa chống xung đột
    ├── utils/
    │   └── dateUtils.ts       # 7 ngày tới, 5 ca 2h, so sánh thời gian & sinh mã đặt phòng
    ├── services/
    │   └── notificationService.ts # Tích hợp expo-notifications (nhắc trước 15 phút)
    ├── store/
    │   └── useBookingStore.ts # Zustand Store + AsyncStorage persistence + Conflict logic
    ├── components/
    │   ├── Badge.tsx          # Các huy hiệu: Trạng thái, Tòa nhà, Sức chứa, Tiện ích
    │   ├── RoomCard.tsx       # Card phòng tối ưu React.memo cho FlatList 60fps
    │   ├── FilterSection.tsx  # Thanh tìm kiếm & bộ lọc chip đa tham số
    │   ├── DateSelector.tsx   # Bộ chọn 7 ngày trượt ngang
    │   ├── TimeSlotGrid.tsx   # Lưới ca học 2h với cơ chế chống trùng lịch trực quan
    │   └── BookingPassModal.tsx # Thẻ thông hành QR Check-in & Quản lý hủy ca
    ├── screens/
    │   ├── HomeScreen.tsx     # Khám phá phòng, tìm kiếm & bộ lọc
    │   ├── RoomDetailScreen.tsx # Chi tiết thông số, chọn ngày, ca học & đặt chỗ
    │   ├── MyBookingsScreen.tsx # Lịch sử đặt chỗ, tab phân loại & xem vé QR
    │   └── ProfileScreen.tsx  # Thẻ sinh viên VKU, thống kê & nút thử thông báo
    └── navigation/
        ├── types.ts           # Navigation param lists
        └── AppNavigator.tsx   # Bottom Tab + Native Stack Navigator
```

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

Dự án đã được cấu hình tương thích hoàn toàn với Windows PowerShell và các thư mục có ký tự đặc biệt (`&`).

### 1. Khởi động Máy chủ Phát triển Expo:
```bash
npm start
```
Hoặc mở trực tiếp trên các nền tảng:
- Chạy trên Android (Expo Go / Emulator): `npm run android`
- Chạy trên iOS Simulator (nếu dùng macOS): `npm run ios`
- Chạy trên Web: `npm run web`

### 2. Quét QR trên Điện thoại Thực:
1. Tải ứng dụng **Expo Go** từ Google Play Store (Android) hoặc Apple App Store (iOS).
2. Chạy `npm start` trên máy tính.
3. Mở Expo Go và quét mã QR hiển thị trên màn hình terminal.

### 3. Kiểm tra TypeScript:
```bash
npm run typecheck
```

---

## 🧪 Kịch Bản Kiểm Thử Đánh Giá (Demo Scenarios)

1. **Kiểm tra Chống trùng lịch (Conflict Prevention)**:
   - Vào phòng `Phòng Lab AI & Robotics V.402`.
   - Chọn ngày **Hôm nay**: Ca 2 (`09:30 - 11:30`) và Ca 4 (`15:00 - 17:00`) sẽ hiển thị màu đỏ `Đã đặt` (khóa nút chọn).
   - Chọn sang **Ca 3** (`13:00 - 15:00`) đang trống: Nhấn chọn, điền mục đích họp nhóm và bấm `Xác nhận giữ chỗ`.
   - Ngay lập tức mở Thẻ điện tử VKU Smart Pass với mã QR sinh viên và thông báo thành công.
   - Quay lại màn hình chọn ca: Ca 3 giờ đã chuyển sang trạng thái đã đặt!

2. **Kiểm tra Bộ Lọc Đa Tham số**:
   - Bấm chip `Khu V`: Chỉ hiển thị các phòng tại tòa nhà Việt - Hàn.
   - Bấm `Đang trống ngay`: Lọc các phòng hiện không bị chiếm dụng ở ca hiện tại.
   - Bấm `Bộ lọc thêm`: Chọn `PC cấu hình cao` + `Nhỏ (2–4 SV)`.

3. **Kiểm tra Check-in QR & Hủy phòng**:
   - Chuyển sang Tab `Lịch đặt`.
   - Bấm vào một ca `Sắp tới` -> Bấm `Thẻ Check-in QR`.
   - Bấm `Quét mô phỏng Check-in`: Trạng thái ca chuyển thành `ĐÃ CHECK-IN TẠI CỬA`.
   - Thử bấm `Hủy ca đặt này`: Ca đặt chuyển sang tab `Đã hủy`, khung giờ đó lập tức được giải phóng trên hệ thống.

4. **Kiểm tra Thông báo (expo-notifications)**:
   - Chuyển sang Tab `Sinh viên`.
   - Bấm `Thử nghiệm Thông báo Nhắc nhở`: Thiết bị sẽ hiển thị chuông & banner thông báo nhắc nhở 15 phút trước ca học.
