import { IRole } from '../types/IRole';
import { axiosPrivate } from './axios';

export const getRoles = async () => {
  return (
    await axiosPrivate.get<IRole[]>('/api/roles', {
      withCredentials: true,
    })
  ).data;
};
