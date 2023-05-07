import { TouchableOpacity, View, Text, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import useAuthService from '../../hooks/api/authService'
import sharedStyles from './sharedStyles'

const Login = ({ handleForgotPassword, handleSignupInstead }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const authService = useAuthService()

    const handleLogin = () => {
        authService.login(email, password)
    }

    const passwordInputRef = useRef()

    return (
        <View style={sharedStyles.topContainer}>
            <Text style={sharedStyles.titleText}>Enter Email Address</Text>
            <TextInput
                style={sharedStyles.input}
                placeholder="name@example.com"
                textContentType="emailAddress"
                autoCorrect={false}
                autoCapitalize="none"
                value={email}
                onChangeText={t => setEmail(t)}
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current.focus()}
                blurOnSubmit={false}
            />
            <Text style={sharedStyles.titleText}>Enter Password</Text>
            <TextInput
                secureTextEntry
                style={sharedStyles.input}
                placeholder="Password"
                textContentType="password"
                autoCorrect={false}
                autoCapitalize="none"
                value={password}
                onChangeText={t => setPassword(t)}
                onSubmitEditing={handleLogin}
                ref={passwordInputRef}
            />
            <TouchableOpacity style={sharedStyles.button} onPress={handleLogin}>
                <Text style={sharedStyles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '100%' }} onPress={handleForgotPassword}>
                <Text style={sharedStyles.actionText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignupInstead}>
                <Text style={sharedStyles.actionText}>Sign Up Instead?</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Login
