'use client';

import { Provider, useDispatch } from 'react-redux';
import { rootStore } from './store';

export function ReduxWraper({ children }: { children: React.ReactNode }) {
  return <Provider store={rootStore}>{children}</Provider>;
}
