// features/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  campaigns:[],
  selectedCampaign:[],


};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
   
    setCampaigns: (state, action) => {
      state.campaigns = action.payload;
    },
    setSelectedCampaign: (state, action) => {
        state.selectedCampaign = action.payload;
      },
   
   
    
  },
});

export const { setCampaigns,setSelectedCampaign} = campaignSlice.actions;
export default campaignSlice.reducer;
