import React, { useState, useContext } from 'react';
import { Button, TextInput, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import firebase from '../firebase.js';
import { AuthContext } from '../contexts/auth.js';
import CustomHeader from '../components/CustomHeader';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Add this line
  const [username, setUsername] = useState('');
  const { setUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const [message, setMessage] = useState('');


  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <CustomHeader />,
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage('The passwords do not match.');
      return;
    }

    const auth = getAuth(firebase);
    const db = getFirestore(firebase);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setMessage('');
      navigation.navigate('Greedy Shop');
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username: username,
      });
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        setMessage('The email address is already in use by another account.');
      } else {
        setMessage('An error occurred during registration.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginWindow}>
        <TextInput style={styles.input} placeholder="Username" onChangeText={setUsername} />
        <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" onChangeText={setPassword} secureTextEntry />
        <TextInput style={styles.input} placeholder="Confirm Password" onChangeText={setConfirmPassword} secureTextEntry /> {/* Add this line */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
  },
  loginWindow: {
    width: 300, // or adjust as needed
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 25,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 25,
    color: '#000',
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  message: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
  },
});