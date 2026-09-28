import { NavigatorScreenParams } from '@react-navigation/native';
import { Room, Booking } from '../types';

export type BottomTabParamList = {
  ExploreTab: undefined;
  MyBookingsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<BottomTabParamList>;
  RoomDetail: { room: Room };
  BookingSuccess: { booking: Booking };
};
