import axios from './axios';

interface IItem {
  id: number;
  title: string;
  description: string;
  image: IImage;
}

interface IImage {
  url: string;
  alt: string;
}

export const getItems = async () => {
  return (
    await axios.get<IItem[]>('/items', {
      withCredentials: true,
    })
  ).data;
};
