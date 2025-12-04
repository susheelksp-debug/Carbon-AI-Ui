import { combineReducers } from 'redux';

// slices

import themeReducer from './slices/theme';
import snackbarSlice from "./slices/snakbar"
import authReducer from './slices/auth';


// ----------------------------------------------------------------------


export const combinedReducer = combineReducers({
  theme: themeReducer,
  snackbar: snackbarSlice,
  auth: authReducer,
});

export const rootReducer = (state, action) => {
  if (action.type === "RESET_APP") {
    // Return undefined to effectively reset the state to its initial values
    state = undefined;
  }
  return combinedReducer(state, action);
};




