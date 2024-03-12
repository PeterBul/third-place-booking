import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosError, CanceledError } from 'axios';
import useAuth from '../hooks/useAuth';

interface IUser {
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

const Users = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('/users', {
          signal: controller.signal,
          withCredentials: true,
        });
        isMounted && setUsers(response.data);
      } catch (error) {
        if (error instanceof CanceledError) {
          return;
        }
        console.error(error);
        if (error instanceof AxiosError) {
          // TODO: Make a shared axios error handler
          if (error?.response?.status === 401) {
            setAuth({});
          }
          navigate('/login', { state: { from: location }, replace: true });
        }
      }
    };
    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <article>
      <h2>Users List</h2>
      {users.length ? (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{`${user.firstName} ${user.lastName}`}</li>
          ))}
        </ul>
      ) : (
        <p>No users found</p>
      )}
    </article>
  );
};

export default Users;
