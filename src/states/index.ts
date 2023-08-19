import { atom } from 'recoil';

export const scrollYState = atom({
  key: 'scrollYState',
  default: 0,
});

export const loggedInState = atom({
  key: 'loggedInState',
  default: false,
});

export const token = atom({
  key: 'token',
  default: '',
});
