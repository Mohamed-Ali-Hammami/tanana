// src/utils/getInitialState.ts
import { headers } from 'next/headers';
import { cookieToInitialState } from 'wagmi';
import { config } from '@/config';

export const getInitialState = async () => {
  const  cookies=  (await headers()).get('cookie'); // Fetch cookies from headers
  return cookieToInitialState(config, cookies); // Convert cookies to initial state
};
