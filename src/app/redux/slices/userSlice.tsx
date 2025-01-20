import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  _id: string;
  country_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  pfp_path: string;
  phone: string
  gender: string;
  categories: string[];
  status: string;
}

const initialState: UserState = {
  _id: '',
  country_id: '',
  email: '',
  first_name: '',
  last_name: '',
  role: '',
  pfp_path: '',
  phone: '',
  gender: '',
  categories: [],
  status: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;