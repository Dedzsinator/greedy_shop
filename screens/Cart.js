import React, { useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TextInput } from 'react-native';
import { AuthContext } from '../contexts/auth'
import { CartContext } from '../contexts/CartContext';
import firebase from 'firebase';
import PriorityQueue from '../components/PriorityQueue.js';

export default function Cart() {
  const { cart, setCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [queuePosition, setQueuePosition] = useState(null);
  const [quantitiesToRemove, setQuantitiesToRemove] = useState({});
  const [priorityQueue, setPriorityQueue] = useState(new PriorityQueue());

  const handleRemove = (id, quantityToRemove) => {
    setCart(prevCart => prevCart.map(item => {
      if (item.id === id) {
        if (item.quantity > quantityToRemove) {
          return { ...item, quantity: item.quantity - quantityToRemove };
        } else {
          return null;
        }
      } else {
        return item;
      }
    }).filter(item => item !== null));
  };
  
  useEffect(() => {
    const fetchOrders = async () => {
      const ordersSnapshot = await firebase.firestore().collection('orders').get();
      const orders = ordersSnapshot.docs.map(doc => doc.data());

      // Create a new priority queue and add the orders to it
      const newPriorityQueue = new PriorityQueue();
      orders.forEach(order => newPriorityQueue.enqueue(order, order.totalPrice));

      setPriorityQueue(newPriorityQueue);

      // Determine the user's position in the priority queue
      const position = newPriorityQueue.getPosition(user.email);
      setQueuePosition(position);
    };

    fetchOrders();
  }, []);

  const handleCheckout = async () => {
    const orderId = 'order' + Date.now();
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const orderData = {
      username: user.email,
      cart,
      totalPrice,
    };
  
    await firebase.firestore().collection('orders').doc(orderId).set(orderData);

    priorityQueue.destroy();
    setPriorityQueue(null);
  };
    console.log(cart);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View>
          <Text>{item.name}</Text>
          <Text>Quantity: {item.quantity}</Text>
        </View>
        <View style={{ width: '40%' }}>
          <TextInput
            style={styles.input}
            onChangeText={text => setQuantitiesToRemove({ ...quantitiesToRemove, [item.id]: text })}
            value={quantitiesToRemove[item.id]}
            placeholder="Quantity to remove"
            keyboardType="numeric"
          />
          <Button title="Remove from Cart" onPress={() => handleRemove(item.id, quantitiesToRemove[item.id])} />
        </View>
      </View>
    </View>
  );

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
      <Text>Nincsenek termékek a kosárban.</Text>
    ) : (
      <>
      {queuePosition !== null && (
        <Text style={styles.queuePosition}>
          Your position in the priority queue: {queuePosition}
        </Text>
      )}
      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}>Total Price: {totalPrice}</Text>

        <Button title="Checkout" onPress={handleCheckout} />
      </View>
      </>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  queuePosition: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  card: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  totalPriceContainer: {
    padding: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});