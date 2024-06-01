import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import ordersSlice from './slices/ordersSlice'


const store = configureStore({
  reducer: {
    auth: authSlice,
    orders: ordersSlice
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store