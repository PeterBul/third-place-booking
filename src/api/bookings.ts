import axios from './axios';
import { IItem } from './items';
import { IUser } from './users';
export interface IBooking {
  id: number;
  createdAt: string;
  updatedAt?: string;
  pickupDate: string;
  returnDate: string;
  comment: string | null;
  isPickedUp: boolean;
  isReturned: boolean;
  user?: IUser;
}

interface IBookingWithItems extends IBooking {
  items: IItem[];
}

interface IBookingWithUserId extends IBooking {
  userId: number;
}

export const getBookings = async () => {
  return (
    await axios.get<IBookingWithUserId[]>('/bookings', {
      withCredentials: true,
    })
  ).data;
};

export const getBooking = async (id: number) => {
  return (
    await axios.get<IBookingWithItems>(`/bookings/${id}`, {
      withCredentials: true,
    })
  ).data;
};

export const createBooking = async (
  booking: Omit<IBooking, 'id' | 'createdAt' | 'isPickedUp' | 'isReturned'>
) => {
  return await axios.post<IBooking>('/bookings', booking, {
    withCredentials: true,
  });
};

export const editBooking = async (booking: Partial<IBooking>) => {
  return await axios.patch<IBooking>(`/bookings/${booking.id}`, booking, {
    withCredentials: true,
  });
};
