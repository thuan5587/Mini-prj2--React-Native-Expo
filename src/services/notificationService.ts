import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Booking } from '../types';

// Set global notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return true;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('booking-reminders', {
        name: 'Nhắc nhở Đặt phòng VKU',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1A56DB',
        sound: 'default',
      });
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.warn('Notifications permission error:', error);
    return false;
  }
}

/**
 * Schedule a check-in alert 15 minutes before the booked slot starts.
 */
export async function scheduleBookingReminder(booking: Booking): Promise<string | undefined> {
  try {
    await registerForPushNotificationsAsync();

    // Parse date and slotStartTime (e.g. date: "2026-09-28", slotStartTime: "13:00")
    const [year, month, day] = booking.date.split('-').map(Number);
    const [startHour, startMinute] = booking.slotStartTime.split(':').map(Number);

    const slotDateTime = new Date(year, month - 1, day, startHour, startMinute, 0);
    // 15 minutes before start
    const reminderTime = new Date(slotDateTime.getTime() - 15 * 60 * 1000);
    const now = new Date();

    const title = `🔔 Nhắc nhở Check-in: ${booking.roomName}`;
    const body = `Ca của bạn (${booking.slotStartTime} - ${booking.slotEndTime}) tại ${booking.roomNumber} sẽ bắt đầu sau 15 phút. Chuẩn bị mã QR để check-in!`;

    // If reminder time is in the future, schedule at reminderTime
    // If it's already within 15 minutes or today for immediate demo, trigger in 5 seconds
    const diffMs = reminderTime.getTime() - now.getTime();
    
    let trigger: Notifications.NotificationTriggerInput;

    if (diffMs > 5000) {
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderTime,
        channelId: 'booking-reminders',
      };
    } else {
      // Immediate demonstration: schedule in 5 seconds
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
        repeats: false,
        channelId: 'booking-reminders',
      };
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          bookingId: booking.id,
          bookingCode: booking.bookingCode,
          roomNumber: booking.roomNumber,
        },
        sound: true,
      },
      trigger,
    });

    return notificationId;
  } catch (error) {
    console.warn('Failed to schedule local notification:', error);
    return undefined;
  }
}

/**
 * Cancel a scheduled reminder
 */
export async function cancelBookingReminder(notificationId?: string): Promise<void> {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.warn('Failed to cancel notification:', error);
  }
}

/**
 * Send an instant demo notification for immediate verification
 */
export async function triggerInstantDemoNotification(roomName: string, slot: string): Promise<void> {
  try {
    await registerForPushNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Đặt phòng thành công!',
        body: `Bạn đã giữ chỗ thành công tại ${roomName} (${slot}). Hệ thống sẽ nhắc bạn 15 phút trước ca học.`,
        sound: true,
      },
      trigger: null, // immediate
    });
  } catch (error) {
    console.warn('Failed to send immediate notification:', error);
  }
}
