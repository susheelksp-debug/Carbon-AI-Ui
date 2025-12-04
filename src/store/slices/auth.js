import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false,
    user: null,
    token: null,
    tokenExpireModal: false
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setTokenExpireModal(state, action) {
            state.tokenExpireModal = action.payload;
        }
    }
});

export const { loginSuccess, setTokenExpireModal } = authSlice.actions;
export default authSlice.reducer;