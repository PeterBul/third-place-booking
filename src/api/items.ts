import { axiosPrivate } from './axios';
import { IBooking } from './bookings';
import { IImage } from './images';

export interface IItem {
  id: number;
  title: string;
  description: string;
  image?: WithId<IImage>;
  bookings: IBooking[];
}

export const getItems = async () => {
  return (
    await axiosPrivate.get<IItem[]>('/api/items', {
      withCredentials: true,
    })
  ).data;
};

export const editItem = async (item: Partial<IItem> & { id: number }) => {
  return (
    await axiosPrivate.patch<IItem>(`/api/items/${item.id}`, item, {
      withCredentials: true,
    })
  ).data;
};

export const createItem = async (item: Partial<IItem>) => {
  return (
    await axiosPrivate.post<IItem>('/api/items', item, {
      withCredentials: true,
    })
  ).data;
};

export const deleteItem = async (id: number) => {
  return (
    await axiosPrivate.delete<void>(`/api/items/${id}`, {
      withCredentials: true,
    })
  ).data;
};
