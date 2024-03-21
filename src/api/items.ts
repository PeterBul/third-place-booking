import { axiosPrivate } from './axios';
import { IBooking } from './bookings';
import { IImage } from './images';

export interface IItem {
  id: number;
  title: string;
  description: string;
  image: WithId<IImage>;
  bookings: IBooking[];
}

export const getItems = async () => {
  return (
    await axiosPrivate.get<IItem[]>('/items', {
      withCredentials: true,
    })
  ).data;
};

export const editItem = async (item: Partial<IItem> & { id: number }) => {
  return (
    await axiosPrivate.patch<IItem>(`/items/${item.id}`, item, {
      withCredentials: true,
    })
  ).data;
};
