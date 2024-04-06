import { IRole } from '../types/IRole';
import { axiosPrivate } from './axios';

export interface IUser {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  phone: string;
  name: string;
  isMemberThirdPlace: boolean;
  isMemberBloom: boolean;
  roles?: number[];
}

export const getUsers = async () => {
  return (
    await axiosPrivate.get<IUser[]>('/api/users', {
      withCredentials: true,
    })
  ).data;
};

export const editUser = async (user: Partial<IUser> & { id: number }) => {
  return (
    await axiosPrivate.patch<IUser>(`/api/users/${user.id}`, user, {
      withCredentials: true,
    })
  ).data;
};

export const getMe = async () => {
  return (
    await axiosPrivate.get<IUser>('/api/users/me', { withCredentials: true })
  ).data;
};

export const getUserRoles = async (userId: number | undefined) => {
  if (!userId) {
    return undefined;
  }
  return (
    await axiosPrivate.get<IRole[]>(`/api/users/${userId}/roles`, {
      withCredentials: true,
    })
  ).data;
};

export const addRolesToUser = async (props: {
  userId: number;
  roles: number[];
}) => {
  await axiosPrivate.post(`/api/users/${props.userId}/roles`, props.roles, {
    withCredentials: true,
  });
};

export const removeRolesFromUser = async (props: {
  userId: number;
  roles: number[];
}) => {
  await axiosPrivate.delete(`/api/users/${props.userId}/roles`, {
    data: props.roles,
    withCredentials: true,
  });
};

export const getMyRoles = async () => {
  return (
    await axiosPrivate.get<number[]>('/api/users/me/roles', {
      withCredentials: true,
    })
  ).data;
};
