import React, { useState, useContext, useEffect } from 'react';
import { Button, TextInput, View, StyleSheet } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { collection, getDocs, orderBy, limit, query as createQuery, doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AuthContext } from '../contexts/auth.js';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../components/CustomHeader';

export default function ModeratorPanel() {
  const { setUser } = useContext(AuthContext);
  const [items, setItems] = useState(Array(5).fill().map(() => ({ desc: '', img: '', name: '', price: '' })));
  const navigation = useNavigation();

  const handleAddItem = () => {
    setItems([...items, { desc: '', img: '', name: '', price: '' }]);
  };

  const handleItemChange = (text, index, field) => {
    const newItems = [...items];
    newItems[index][field] = text;
    setItems(newItems);
  };

  const handleSubmit = async () => {
    const db = getFirestore(firebase);
    const productsRef = collection(db, 'products');
    const q = createQuery(productsRef, orderBy('__name__', 'desc'), limit(1));
    const querySnapshot = await getDocs(q);
    let maxId = 0;
    querySnapshot.forEach((doc) => {
      const idNum = parseInt(doc.id.replace('product', ''), 10);
      maxId = idNum > maxId ? idNum : maxId;
    });
  
    items.forEach(async (item, index) => {
      maxId++;
      const docRef = doc(productsRef, 'product' + maxId);
      await setDoc(docRef, item);
      console.log('Document written with ID: ', docRef.id);
    });
  };

  const handleLogout = () => {
    const auth = getAuth(firebase);
    signOut(auth).then(() => {
      setUser(null);
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <CustomHeader />,
    });
  }, [navigation]);


  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.inputGroup}>
          <TextInput
            value={item.desc}
            onChangeText={(text) => handleItemChange(text, index, 'desc')}
            placeholder="Description"
            style={styles.input}
          />
          <TextInput
            value={item.img}
            onChangeText={(text) => handleItemChange(text, index, 'img')}
            placeholder="Image URL"
            style={styles.input}
          />
          <TextInput
            value={item.name}
            onChangeText={(text) => handleItemChange(text, index, 'name')}
            placeholder="Name"
            style={styles.input}
          />
          <TextInput
            value={item.price}
            onChangeText={(text) => handleItemChange(text, index, 'price')}
            placeholder="Price"
            style={styles.input}
          />
        </View>
      ))}
      <Button title="Add Item" onPress={handleAddItem} />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    inputGroup: {
      marginBottom: 20,
      padding: 20,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#000',
    },
    input: {
      marginBottom: 10,
      borderWidth: 1, // Add this line
      borderColor: '#000', // Add this line
    },
  });