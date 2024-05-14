import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  dashboardData:{},
  
}

export const dashboardDataSlice = createSlice({
  name: 'dashboardData',
  initialState,
  reducers: {
    
    
    setDashboardData: (state, action) => {
        state.dashboardData = action.payload
      },
      
  },
})

// Action creators are generated for each case reducer function
export const { setDashboardData} = dashboardDataSlice.actions

export default dashboardDataSlice.reducer