import axios from './axios';

export const getBookings = async () => {
  return await axios.get('/bookings', {
    withCredentials: true,
  });
};
