import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { PersistConfig } from 'redux-persist';
import { RootState } from './store';

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  whitelist: ['user', 'auth'], // which reducer(s) you want to persist
};

export default persistConfig;