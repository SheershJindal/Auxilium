import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: "",
        isLoading: true,
        isLoggedIn: false,
        user: {}
    },
    reducers: {
        loginUser: (state, action) => {
            state.isLoggedIn = true
            state.isLoading = false;
            const { user, token } = action.payload;
            state.token = token
            state.user = user
            AsyncStorage.setItem('@token', token)
        },
        logoutUser: (state) => {
            AsyncStorage.removeItem('@token')
            state.isLoggedIn = false;
            state.token = "";
        },
        setLoaded: (state) => {
            state.isLoading = false;
        },
        setLoading: (state) => {
            state.isLoading = true;
        }
    }
})
export const { loginUser, logoutUser, setLoaded, setLoading } = authSlice.actions

export default authSlice.reducer