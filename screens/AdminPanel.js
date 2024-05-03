import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firebase from '../firebase.js';
import PriorityQueue from '../components/PriorityQueue.js';
import { collection, getDocs, getFirestore, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const orderQueue = new PriorityQueue((a, b) => a.totalPrice > b.totalPrice);

  useEffect(() => {
    const fetchOrders = async () => {
      const firestore = getFirestore(firebase);
      const orderCollection = collection(firestore, 'orders');
      const orderSnapshot = await getDocs(orderCollection);

      orderSnapshot.forEach((doc) => {
        orderQueue.push({ id: doc.id, ...doc.data() });
      });

      setOrders([...orderQueue.toArray()]);
    };
  
    fetchOrders();
  }, []);

  const handleRemoveTopOrder = async () => {
    const topOrder = orderQueue.pop();
    const orderDoc = doc(db, 'orders', topOrder.id);
    await deleteDoc(orderDoc);

    setOrders([...orderQueue.toArray()]);
    alert('Order is given');
  };

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <Text>Nincsenek rendelések</Text>
      ) : (
        orders.map((order, index) => (
          <View key={index} style={styles.orderContainer}>
            <Text style={styles.orderText}>Order ID: {order.id}</Text>
            <Text style={styles.orderText}>Total Price: {order.totalPrice}</Text>
            <Text style={styles.orderText}>User: {order.username}</Text>
            <Picker>
              {order.cart.items.map((item, index) => (
                <Picker.Item key={index} label={item.name} value={item.id} />
              ))}
            </Picker>
          </View>
        ))
      )}
      <Button title="Remove Top Order" onPress={handleRemoveTopOrder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
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
});