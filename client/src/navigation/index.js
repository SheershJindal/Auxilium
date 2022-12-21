import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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
import Community from '../screens/Community';

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

   const HomeMobileStack = () => {
      return (
         <Drawer.Navigator
            drawerContent={props => {
               const filteredProps = {
                  ...props,
                  state: {
                     ...props.state,
                     routeNames: props.state.routeNames.filter(routeName => {
                        routeName !== 'Discover';
                     }),
                     routes: props.state.routes.filter(route => route.name !== 'Discover'),
                  },
               };
               return <CustomDrawer {...filteredProps} />;
            }}
         >
            <Drawer.Screen name="Discover" component={Discover} />
            <Drawer.Screen name="Community" component={Community} />
         </Drawer.Navigator>
      );
   };

   const Screen = () => (
      <View>
         <Text>index</Text>
      </View>
   );

   const TabScreens = () => (
      <Tab.Navigator
         screenOptions={{
            tabBarStyle: {
               position: 'absolute',
               bottom: 20,
               left: 20,
               right: 20,
               borderRadius: 15,
               height: 50,
               ...styles.shadow,
            },
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.secondary,
         }}
      >
         <Tab.Screen
            name="Home"
            component={HomeMobileStack}
            options={{
               headerShown: false,
               tabBarIcon: ({ focused }) => (
                  <Entypo name="home" size={24} color={focused ? colors.primary : colors.secondary} />
               ),
            }}
         />
         <Tab.Screen
            name="Announcement"
            component={Screen}
            options={{
               title: 'Announcements',
               tabBarIcon: ({ focused }) => (
                  <Entypo name="megaphone" size={30} color={focused ? colors.primary : colors.secondary} />
               ),
            }}
         />
         <Tab.Screen
            name="Settings"
            component={Screen}
            options={{
               tabBarIcon: ({ focused }) => (
                  <Ionicons name="settings" size={24} color={focused ? colors.primary : colors.secondary} />
               ),
            }}
         />
      </Tab.Navigator>
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
               {!isLoading && isSignedIn && <TabScreens />}
            </View>
         </NavigationContainer>
      </SafeAreaProvider>
   );
};

const styles = StyleSheet.create({
   shadow: {
      shadowColor: colors.secondary,
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
   },
});
export default Routes;
