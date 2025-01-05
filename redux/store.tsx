// store.js
import { configureStore } from '@reduxjs/toolkit';
import userDataSlice from './reducers/userDataSlice';
import campaignSlice from './reducers/campaignSlice';
import adminSlice from './reducers/adminSlice';




 // Importing the correct reducer from counterSlice.js

const store = configureStore({
  reducer: {
    userData:userDataSlice,
    campaign:campaignSlice,
    admin:adminSlice
 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
