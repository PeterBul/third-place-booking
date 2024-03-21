import axios from './axios';

export interface IImage {
  url: string;
  alt: string;
  isClippable: boolean;
}

export const getImages = async () => {
  return (
    await axios.get<WithId<IImage>[]>('/images', { withCredentials: true })
  ).data;
};

export const editImage = async (image: WithId<Partial<IImage>>) => {
  return await axios.patch<IImage>(`/images/${image.id}`, image, {
    withCredentials: true,
  });
};
