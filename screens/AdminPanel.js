import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import firebase from '../firebase.js';
import PriorityQueue from '../components/PriorityQueue.js';

export default function AdminPanel() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await firebase.firestore().collection('orders').get();
      const ordersArray = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const ordersQueue = new PriorityQueue({ comparator: (a, b) => b.totalPrice - a.totalPrice });
      ordersArray.forEach(order => ordersQueue.queue(order));
      setOrders(Array.from(ordersQueue));
    };

    fetchOrders();
  }, []);

  return (
    <View>
      {orders.length === 0 ? (
        <Text>Nincsenek rendelések</Text>
      ) : (
        orders.map((order, index) => (
          <View key={index}>
            <Text>Order ID: {order.id}</Text>
            <Text>Total Price: {order.totalPrice}</Text>
            <Text>User: {order.username}</Text>
          </View>
        ))
      )}
    </View>
  );
}