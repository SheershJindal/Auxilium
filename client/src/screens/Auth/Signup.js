import { TouchableOpacity, View, Text, TextInput } from 'react-native'
import React, { useRef, useState } from 'react'
import useAuthService from '../../hooks/api/authService'
import sharedStyles from './sharedStyles'
import { useEffect } from 'react'

const Signup = ({ handleLoginInstead }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [passwordMatch, setPasswordMatch] = useState(false)
    const authService = useAuthService()

    const handleSignup = () => {
        if (!passwordMatch) { console.error("Password not match"); return }
        authService.signup(username, email, password)
    }

    useEffect(() => {
        if (password == "" || confirmPassword == "") { setPasswordMatch(false); return }
        const match = password == confirmPassword
        setPasswordMatch(match)
    }, [password, confirmPassword])


    const emailInputRef = useRef()
    const passwordInputRef = useRef()
    const confirmPasswordInputRef = useRef()

    return (
        <View style={sharedStyles.topContainer}>
            <Text style={sharedStyles.titleText}>Enter Username</Text>
            <TextInput
                style={sharedStyles.input}
                placeholder="Username"
                textContentType="name"
                autoCorrect={false}
                autoCapitalize="words"
                value={username}
                onChangeText={t => setUsername(t)}
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current.focus()}
                blurOnSubmit={false}
            />
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
                ref={emailInputRef}
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
                onSubmitEditing={() => confirmPasswordInputRef.current.focus()}
                ref={passwordInputRef}
            />
            <Text style={sharedStyles.titleText}>Confirm Password</Text>
            <TextInput
                secureTextEntry
                style={sharedStyles.input}
                placeholder="Password"
                textContentType="password"
                autoCorrect={false}
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={t => setConfirmPassword(t)}
                onSubmitEditing={handleSignup}
                ref={confirmPasswordInputRef}
            />
            <TouchableOpacity style={sharedStyles.button} onPress={handleSignup}>
                <Text style={sharedStyles.buttonText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLoginInstead}>
                <Text style={sharedStyles.actionText}>Login Instead?</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Signup
