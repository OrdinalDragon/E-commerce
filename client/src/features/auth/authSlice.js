import { createSlice } from '@reduxjs/toolkit';

const loadUser = () => {
  try {
    const data = localStorage.getItem('userInfo');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const initialState = {
  userInfo: loadUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
