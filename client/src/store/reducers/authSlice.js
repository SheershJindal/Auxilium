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
            const token = action.payload;
            // state.token = token
            state.token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsInVzZXJJZCI6IjY0MzZlZWFlMjI2ZjY2NThmYzY1MTI1OSIsImVtYWlsIjoia3NoaXRpekBramRrc2FsLmNvbSIsImV4cCI6MTY4MjYxNzY5OC44MDgsImlhdCI6MTY4MTMyMTY5OH0.gUpasUWWRHhlPd2KC3c4gjWcQm9IdHfvT3RPKVcb6tU"
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