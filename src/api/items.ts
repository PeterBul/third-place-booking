import axios from './axios';
import { IBooking } from './bookings';

export interface IItem {
  id: number;
  title: string;
  description: string;
  image: IImage;
  bookings: IBooking[];
}

interface IImage {
  url: string;
  alt: string;
  isClippable: boolean;
}

export const getItems = async () => {
  return (
    await axios.get<IItem[]>('/items', {
      withCredentials: true,
    })
  ).data;
};
