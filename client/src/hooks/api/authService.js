import { getAuthenticatedAxios, getUnauthenticatedAxios } from "./baseConfig"
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch, useSelector } from "react-redux"
import { loginUser, logoutUser, setLoaded, setLoading } from "../../store/reducers/authSlice"
import { useEffect } from "react"


const useAuthService = () => {
    const dispatch = useDispatch()

    const tokenFromStore = useSelector(state => state.auth.token)

    const login = async (email, password) => {
        try {
            const unauthenticatedAxios = getUnauthenticatedAxios('/auth');
            const response = await unauthenticatedAxios.post('/signin', { email, password });
            let token = response.token;
            const user = response.user;
            token = `Bearer ${token}`
            dispatch(loginUser({ token, user }))
        } catch (error) {
            throw error
        }
    }

    const signup = async (username, email, password) => {
        try {
            const unauthenticatedAxios = getUnauthenticatedAxios('/auth')
            const response = await unauthenticatedAxios.post('/signup', { username, email, password })
            let { user, token } = response
            token = `Bearer ${token}`
            dispatch(loginUser({ user, token }))
            return user;
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        dispatch(logoutUser())
    }


    const forgot = async (email) => {

    }

    const reset = async (email, otp, password) => {
        alert("Reset")

    }

    const getUserFromToken = async () => {
        try {
            dispatch(setLoading())
            const token = await AsyncStorage.getItem('@token');
            if (!token) return;
            const authenticatedAxios = getAuthenticatedAxios('/auth', token);
            const user = await authenticatedAxios.get('/me');
            dispatch(loginUser({ token, user }))
            return user;
        } catch (error) {
            throw error;
        }
        finally {
            dispatch(setLoaded())
        }
    }



    return { login, signup, logout, forgot, reset, getUserFromToken, token: tokenFromStore }

}

export default useAuthService;