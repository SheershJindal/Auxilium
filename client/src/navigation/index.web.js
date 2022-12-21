import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native/';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Auth from '../screens/Auth';
import useAuthService from '../hooks/api/authService';
import linking from './linking';
import CustomDrawer from './Drawer';
import colors from '../theme/colors';
import Discover from '../screens/Discover';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import VerifyPassword from '../screens/Auth/VerifyPassword';
import HomeWebStack from '../screens/HomeWeb/HomeWebStack';

const Routes = () => {
   const isLoading = useSelector(state => state.auth.isLoading);
   const isSignedIn = useSelector(state => state.auth.isLoggedIn);
   const AuthStack = createNativeStackNavigator();
   const Tab = createBottomTabNavigator();
   const Drawer = createDrawerNavigator();

   const authService = useAuthService();

   const dispatch = useDispatch();

   useEffect(() => {
      authService.getUserFromToken();
   }, []);

   const AuthStackScreens = () => (
      <AuthStack.Navigator screenOptions={{ animation: 'slide_from_right' }}>
         <AuthStack.Screen name="Auth" component={Auth} />
         <AuthStack.Screen name="Forgot" component={ForgotPassword} />
         <AuthStack.Screen name="Verification" component={VerifyPassword} />
      </AuthStack.Navigator>
   );

   return (
      <SafeAreaProvider>
         <NavigationContainer linking={linking}>
            <View style={{ flex: 1 }}>
               {isLoading && (
                  <View style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
                     <Text style={{ textAlign: 'center' }}>Loading....</Text>
                  </View>
               )}
               {!isLoading && !isSignedIn && <AuthStackScreens />}
               {!isLoading && isSignedIn && <HomeWebStack />}
            </View>
         </NavigationContainer>
      </SafeAreaProvider>
   );
};

export default Routes;
