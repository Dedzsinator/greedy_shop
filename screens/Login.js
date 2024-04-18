import React, { useState, useContext } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebase from '../firebase.js';
import { AuthContext } from '../contexts/auth.js';
import AdminPanel  from '../screens/AdminPanel.js';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    console.log('handleLogin called');
    if (email === 'admin' && password === 'admin') {
      console.log('navigating to AdminPanel');
      navigation.navigate('AdminPanel');
    } else {
      console.log('attempting to sign in with Firebase Authentication');
      const auth = getAuth(firebase);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('signed in with Firebase Authentication', userCredential.user);
        setUser(userCredential.user);
        setMessage('Logged in successfully');
      } catch (error) {
        console.error('error signing in with Firebase Authentication', error);
        setMessage('Invalid credentials');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text>{message}</Text> {/* Add this line */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  input: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});