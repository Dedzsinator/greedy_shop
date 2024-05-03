import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, Dimensions, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firebase from '../firebase.js';
import PriorityQueue from '../components/PriorityQueue.js';
import { collection, getDocs, getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

const screenHeight = Dimensions.get('window').height;

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [orderQueue, setOrderQueue] = useState(new PriorityQueue((a, b) => a.totalPrice > b.totalPrice));
  const [promptOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchOrders = async () => {
      const firestore = getFirestore(firebase);
      const orderCollection = collection(firestore, 'orders');
      const orderSnapshot = await getDocs(orderCollection);
    
      const tempQueue = new PriorityQueue((a, b) => a.totalPrice > b.totalPrice);
      orderSnapshot.forEach((doc) => {
        tempQueue.push({ id: doc.id, ...doc.data() });
      });
    
      setOrders(tempQueue.toArray());
      setOrderQueue(tempQueue);
    };
    
    fetchOrders();
  }, []);

  const animatePrompt = () => {
    Animated.timing(promptOpacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(promptOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleRemoveTopOrder = async () => {
    if (!orderQueue.isEmpty()) {
      const topOrder = orderQueue.pop();
      
      // Get a reference to the Firestore service
      const firestore = getFirestore(firebase);
  
      // Get a reference to the document in the 'orders' collection with the given ID
      const orderDoc = doc(firestore, 'orders', topOrder.id);
  
      // Delete the document
      await deleteDoc(orderDoc);
  
      // Update the orders state
      setOrders([...orderQueue.toArray()]);
      animatePrompt();
    } else {
      alert('No orders to remove');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={{ ...styles.prompt, opacity: promptOpacity }}>Order is given</Animated.Text>
      <View style={styles.buttonContainer}>
        <Button title="Remove Top Order" onPress={handleRemoveTopOrder} />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={true}
      >
          {orders.map((order, index) => (
            <View key={index} style={styles.orderContainer}>
              <Text style={styles.orderText}>Order ID: {order.id}</Text>
              <Text style={styles.orderText}>Total Price: {order.totalPrice}</Text>
              <Text style={styles.orderText}>User: {order.username}</Text>
              {order.cart.map((item, index) => (
                <Text key={index} style={styles.itemText}>{`${item.name} x${item.quantity}`}</Text>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
  );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // stack children vertically
  },
  scrollView: {
    maxHeight: screenHeight - 50, // reduce maxHeight by the height of the button
  },
  orderContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
  },
  orderText: {
    fontSize: 16,
  },
  buttonContainer: {
    height: 40, // set a fixed height for the button
    marginBottom: 10, // add some margin at the bottom
  },
  itemText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  prompt: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    margin: 10,
  },
});