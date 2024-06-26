import { axiosPrivate } from './axios';

export interface IImage {
  url: string;
  alt: string;
  isClippable: boolean;
}

export const getImages = async () => {
  return (
    await axiosPrivate.get<WithId<IImage>[]>('/api/images', {
      withCredentials: true,
    })
  ).data;
};

export const editImage = async (image: WithId<Partial<IImage>>) => {
  return await axiosPrivate.patch<IImage>(`/api/images/${image.id}`, image, {
    withCredentials: true,
  });
};

export const createImage = async (image: IImage) => {
  return await axiosPrivate.post<IImage>('/api/images', image, {
    withCredentials: true,
  });
};

export const deleteImage = async (id: number) => {
  return (
    await axiosPrivate.delete<void>(`/api/images/${id}`, {
      withCredentials: true,
    })
  ).data;
};
