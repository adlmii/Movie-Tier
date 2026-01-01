import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});


export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
export const THUMBNAIL_BASE_URL = 'https://image.tmdb.org/t/p/w200';

export const getPosterUrl = (path: string, size: 'small' | 'large' = 'large') => {
  const base = size === 'small' ? THUMBNAIL_BASE_URL : IMAGE_BASE_URL;
  return `${base}${path}`;
};