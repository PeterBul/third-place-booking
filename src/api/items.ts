import { axiosPrivate } from './axios';
import { IBooking } from './bookings';
import { IImage } from './images';
import { z } from 'zod';

export interface IItem {
  id: number;
  title: string;
  description: string;
  image?: WithId<IImage>;
  bookings: IBooking[];
}

const getItemsSchema = z.object({
  from: z.string().datetime().optional(),
});

type GetItemsDto = z.infer<typeof getItemsSchema>;

/**
 * @param from ISO 8601 date string
 * @returns items
 */
export const getItems =
  (dto: GetItemsDto = {}) =>
  async () => {
    const parsedDto = getItemsSchema.parse(dto);
    return (
      await axiosPrivate.get<IItem[]>('/api/items', {
        withCredentials: true,
        params: parsedDto,
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
