import axios from 'axios';

export default axios.create();

export const axiosPrivate = axios.create({
  withCredentials: true,
});
