// features/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDetails:[],
  userBadges:[],
  member:[],

};

const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
   
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setUserBadges: (state, action) => {
        state.userBadges = action.payload;
      },
      setMember: (state, action) => {
        state.member = action.payload;
      },
     
   
    
  },
});

export const { setUserDetails,setUserBadges,setMember} = userDataSlice.actions;
export default userDataSlice.reducer;
