import axios from 'axios';

const myAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
  headers: { 'Content-Type': 'application/json; charset=UTF-8' },
});

export default myAxios;
