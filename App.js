import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from './contexts/auth.js';
import HomeScreen from './screens/Home.js';
import LoginScreen from './screens/Login.js';
import RegisterScreen from './screens/Register.js';
import firebase from './firebase.js';
import LogoutScreen from './screens/Logout.js';
import { CartContextProvider } from './contexts/CartContext.js';
import Cart from './screens/Cart.js';
import AdminPanel from './screens/AdminPanel.js';
import ProductDetail from './screens/DetailedProduct.js';
import ModeratorPanel from './screens/ModeratorPanel.js';

const Stack = createStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(firebase);
    const subscriber = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });
    return subscriber;
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <CartContextProvider>
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
      <Stack.Navigator>
        {user == null ? (
          <>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="AdminPanel" component={AdminPanel} />
            <Stack.Screen name="ModeratorPanel" component={ModeratorPanel} />
            <Stack.Screen name="Greedy Shop" component={HomeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Greedy Shop" component={HomeScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ModeratorPanel" component={ModeratorPanel} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="AdminPanel" component={AdminPanel} />
            <Stack.Screen name="ProductDetail" component={ProductDetail} />
            <Stack.Screen name="Logout" component={LogoutScreen} options={{headerShown: false}} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </AuthContext.Provider>
    </CartContextProvider>
  );
}