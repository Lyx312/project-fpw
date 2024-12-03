import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  email: string;
  password: string;
  rememberMe: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  email: '',
  password: '',
  rememberMe: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setRememberMe(state, action: PayloadAction<boolean>) {
      state.rememberMe = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    resetForm(state) {
      state.email = '';
      state.password = '';
      state.rememberMe = false;
    },
  },
});

export const { setEmail, setPassword, setRememberMe, setLoading, resetForm } =
  authSlice.actions;

export default authSlice.reducer;