import { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native/"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Auth from "../screens/Auth"
import useAuthService from "../hooks/api/authService";
import linking from "./linking";
import CustomDrawer from "./Drawer";
import colors from "../theme/colors";
import Discover from "../screens/Discover";
import ForgotPassword from "../screens/Auth/ForgotPassword";
import VerifyPassword from "../screens/Auth/VerifyPassword";
import Community from "../screens/Community";
import Announcements from "../screens/Announcements"
import Settings from "../screens/Settings"
import Post from "../screens/Post";
import ReactToPost from "../screens/ReactToPost";
import CreatePostHome from "../screens/CreatePostHome";
import Search from "../screens/Search";


const Routes = () => {

    const isLoading = useSelector(state => state.auth.isLoading);
    const isSignedIn = useSelector(state => state.auth.isLoggedIn);
    const user = useSelector(state => state.auth.user);
    const AuthStack = createNativeStackNavigator();
    const AppStack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    const Drawer = createDrawerNavigator();

    const authService = useAuthService()

    const dispatch = useDispatch()

    useEffect(() => {
        authService.getUserFromToken()
    }, [])

    const AuthStackScreens = () => (
        <AuthStack.Navigator screenOptions={{ animation: "slide_from_right" }}>
            <AuthStack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
            <AuthStack.Screen name="Forgot" component={ForgotPassword} />
            <AuthStack.Screen name="Verification" component={VerifyPassword} />
        </AuthStack.Navigator>
    )

    const AppStackScreens = () => (
        <AppStack.Navigator>
            <AppStack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
            <Drawer.Screen name="Search" component={Search} options={{ headerShown: false }} />
            <AppStack.Screen name="Post" component={Post} options={{}} />
            <AppStack.Screen name="ReactToPost" component={ReactToPost} options={({ route }) => ({ title: route.params.title })} />
            <AppStack.Screen name="CreatePost" component={CreatePostHome} initialParams={{ isHome: true, communityName: 'Home' }} options={{ headerShown: false }} />
            <AppStack.Screen name="Community" component={Community} />
        </AppStack.Navigator>
    )

    const HomeMobileStack = () => {
        return <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
            <Drawer.Screen name="Discover" component={Discover}
                options={({ route, navigation }) => ({
                    headerRight: () => (
                        <View style={{ flexDirection: 'row', marginRight: 20, alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginRight: 10, padding: 5, }}>
                                <Ionicons name="search-outline" size={30} onPress={() => navigation.navigate('Search')} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ padding: 5 }} onPress={() => navigation.navigate('CreatePost')} >
                                <Ionicons name="create-outline" size={30} />
                            </TouchableOpacity>
                        </View>
                    )
                })} />
        </Drawer.Navigator>
    }

    const HomeTabs = () => (
        <Tab.Navigator screenOptions={{
            // tabBarStyle: {
            //     position: 'absolute',
            //     bottom: 20,
            //     left: 20,
            //     right: 20,
            //     borderRadius: 15,
            //     height: 50,
            //     ...styles.shadow
            // },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.secondary,
            tabBarHideOnKeyboard: true
        }}
        >
            <Tab.Screen name="Home" component={HomeMobileStack}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => <Entypo name="home" size={24} color={focused ? colors.primary : colors.secondary} />
                }}
            />
            {(user.role == "officer" || user.role == "admin") && <Tab.Screen name="Announcement" component={Announcements}
                options={{
                    title: 'Announcements', tabBarIcon: ({ focused }) =>
                        <Entypo name="megaphone" size={30} color={focused ? colors.primary : colors.secondary} />,
                }} />}
            {/* <Tab.Screen name="Settings" component={Settings}
                options={{
                    tabBarIcon: ({ focused }) =>
                        <Ionicons name="settings" size={24} color={focused ? colors.primary : colors.secondary} />,
                }} /> */}
        </Tab.Navigator>
    )


    return (
        <SafeAreaProvider>
            <NavigationContainer linking={linking}>
                <View style={{ flex: 1 }}>
                    {
                        isLoading &&
                        <View style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                            <Text style={{ textAlign: 'center', }}>Loading....</Text>
                        </View>
                    }
                    {!isLoading && !isSignedIn && <AuthStackScreens />}
                    {!isLoading && isSignedIn && <AppStackScreens />}
                </View>
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: colors.secondary,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
    }
})
export default Routes