import axios from 'axios'

const connect = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getUsers = async () => {
    const response = await connect.get('/users');
    return response.data;
}