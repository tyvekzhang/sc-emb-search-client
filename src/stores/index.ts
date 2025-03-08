import { configureStore, Store } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import dictSlice from '@/stores/modules/dict';

export const store: Store = configureStore({
  reducer: {
    dict: dictSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
