import axios from './axios';
import { IUser } from './users';
export interface IBooking {
  id?: number;
  createdAt: string;
  updatedAt?: string;
  pickupDate: string;
  returnDate: string;
  comment: string | null;
  isPickedUp: boolean;
  isReturned: boolean;
  user?: IUser;
}

export const getBookings = async () => {
  return await axios.get('/bookings', {
    withCredentials: true,
  });
};

export const createBooking = async (
  booking: Omit<IBooking, 'id' | 'createdAt' | 'isPickedUp' | 'isReturned'>
) => {
  return await axios.post<IBooking>('/bookings', booking, {
    withCredentials: true,
  });
};
