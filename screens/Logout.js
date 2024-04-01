import React, { useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import firebase from '../firebase.js';
import { AuthContext } from '../contexts/auth.js';

export default function LogoutScreen() {
  const navigation = useNavigation();
  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    const auth = getAuth(firebase);
    signOut(auth)
      .then(() => {
        setUser(null);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Register' }],
        });
      })
      .catch((error) => console.error(error));
  }, []);

  return null;
}