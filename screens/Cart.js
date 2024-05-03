import React, { useContext, useState, useEffect } from 'react';
import { Animated } from 'react-native';
import { View, Text, FlatList, StyleSheet, Button, TextInput, ScrollView } from 'react-native';
import { AuthContext } from '../contexts/auth'
import { CartContext } from '../contexts/CartContext';
import { getFirestore, collection, doc, setDoc, getDocs } from "firebase/firestore";
import { app } from '../firebase.js';
import PriorityQueue from '../components/PriorityQueue.js';
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

export default function Cart() {
  const { cart, setCart, resetCart} = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [queuePosition, setQueuePosition] = useState(null);
  const [quantitiesToRemove, setQuantitiesToRemove] = useState({});
  const [priorityQueue, setPriorityQueue] = useState(new PriorityQueue());
  const [fadeAnim] = useState(new Animated.Value(0));  // Initial value for opacity: 0
  const [showThankYou, setShowThankYou] = useState(false);

  const db = getFirestore(app);

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
      // Create a new priority queue
      const newPriorityQueue = new PriorityQueue((a, b) => a.totalPrice > b.totalPrice);
  
      // Insert the current user's order
      const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
      const userOrder = {
        username: user.email,
        cart,
        totalPrice,
      };
      newPriorityQueue.push(userOrder);
  
      // Fetch the orders from the database and add them to the queue
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const orders = ordersSnapshot.docs.map(doc => doc.data());
      orders.forEach(order => newPriorityQueue.push(order));
  
      setPriorityQueue(newPriorityQueue);
  
      // Determine the user's position in the priority queue
      const position = getPositionInQueue(newPriorityQueue, userOrder);
      setQueuePosition(position);
    };
  
    fetchOrders();
  }, [cart, user.email]);
  
  // Function to get the position of an item in the priority queue
function getPositionInQueue(queue, item) {
  const queueArray = queue.toArray();
  for (let i = 0; i < queueArray.length; i++) {
    if (JSON.stringify(queueArray[i]) === JSON.stringify(item)) {
      return i + 1; // Positions start at 1
    }
  }
  return -1; // Item not found in the queue
}

    // Inside your Cart component
  const navigation = useNavigation();

  const handleCheckout = async () => {
    try {
      const orderId = 'order' + Date.now();
      const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
      const orderData = {
        username: user.email,
        cart,
        totalPrice,
      };
    
      await setDoc(doc(collection(db, 'orders'), orderId), orderData);
  
      priorityQueue.destroy();
      setPriorityQueue(null);
  
      setShowThankYou(true);
  
      // Fade in the thank you message
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        // After the fade in is complete, start fading out
        Animated.timing(fadeAnim, {
          toValue: 1,
          useNativeDriver: true,
        }).start(() => {
          // After the fade out is complete, navigate to the home page and clear the cart
          navigation.navigate('Greedy Shop');
          resetCart();
          setShowThankYou(false);
        });
      });

    } catch (error) {
      console.error("Error adding order: ", error);
    }
  };

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
      {showThankYou && (
      <Animated.View style={{...styles.thankYouContainer, opacity: fadeAnim}}>
        <Text style={styles.thankYouText}>Thank you for your order</Text>
      </Animated.View>
    )}
      <ScrollView>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  thankYouContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Optional: Add a semi-transparent background
    zIndex: 1, // Make sure the thank you message is above everything else
  },
  thankYouText: {
    fontSize: 50, // Make the text really big
    color: 'white',
    textAlign: 'center',
  },
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