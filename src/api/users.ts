import { axiosPrivate } from './axios';

export interface IUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  isMemberThirdPlace: boolean;
  isMemberBloom: boolean;
}

export const getUsers = async () => {
  return (
    await axiosPrivate.get<IUser[]>('/users', {
      withCredentials: true,
    })
  ).data;
};

export const editUser = async (user: Partial<IUser> & { id: number }) => {
  return (
    await axiosPrivate.patch<IUser>(`/users/${user.id}`, user, {
      withCredentials: true,
    })
  ).data;
};

export const getMe = async () => {
  return (await axiosPrivate.get<IUser>('/users/me', { withCredentials: true }))
    .data;
};
