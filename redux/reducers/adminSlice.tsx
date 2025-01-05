// features/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allMembers:[],

};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
   
    setAllMembers: (state, action) => {
      state.allMembers = action.payload;
    },
   
   
    
  },
});

export const { setAllMembers} = adminSlice.actions;
export default adminSlice.reducer;
