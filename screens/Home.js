import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, Image, FlatList, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, getFirestore, doc, getDoc } from 'firebase/firestore';
import firebase from '../firebase.js';
import { AuthContext } from '../contexts/auth.js';
import { CartContext } from '../contexts/CartContext.js';
import CartIcon from '../components/CartIcon.js';
import Cart from '../screens/Cart.js';
import { ProductDetail } from '../screens/DetailedProduct.js';
import PriorityQueue from '../components/PriorityQueue.js';
import CustomHeader from '../components/CustomHeader';
import { getAuth, signOut } from 'firebase/auth';


const numColumns = Math.floor(Dimensions.get('window').width / 200);

export default function HomeScreen() {
  const productQueue = new PriorityQueue((a, b) => a.price < b.price);

  const { user } = useContext(AuthContext);
  const { cart, addToCart, removeFromCart, resetCart } = useContext(CartContext);
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [inputKey, setInputKey] = useState(Date.now());
  const [username, setUsername] = useState('');

  const resetQuantities = () => {
    setQuantities({});
    setInputKey(Date.now());
  };

  const handleQuantityChange = (quantity, productId) => {
    setQuantities(prevQuantities => ({ ...prevQuantities, [productId]: quantity }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { item: item })}>
        <Image source={{ uri: item.img }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text>{item.name}</Text>
          <Text>{item.price}</Text>
        </View>
      </TouchableOpacity>
      <TextInput
        key={inputKey} // Add this line
        style={styles.quantityInput} placeholder='darabszám'
        placeholderTextColor='#808080'
        onChangeText={(quantity) => handleQuantityChange(quantity, item.id)}
        value={quantities[item.id]}
        keyboardType="numeric"
      />
      <Button title="Add to Cart" onPress={() => handleProductAdd(item)} />
    </View>
  );


  useEffect(() => {
    const fetchUsername = async () => {
      const firestore = getFirestore(firebase);
      const userDoc = doc(firestore, 'users', user.uid);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        setUsername(userData.username); // set the username
      } else {
        console.log('No such document!');
      }
    };
    if (user) {
      fetchUsername();
    }
  }, [user]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <CustomHeader />,
      headerTitleAlign: 'center',
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ marginRight: 10, fontSize: 20 }}>{username}</Text>
          <Button title="Logout" onPress={handleLogout} />
          <TouchableOpacity onPress={() => navigation.navigate('Cart', { cart: cart })}>
            <CartIcon width={120} height={64} />
            {cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, cart, user, username]);

const handleLogout = () => {
  const auth = getAuth(firebase);
  signOut(auth).then(() => {
    navigation.navigate('Login');
  }).catch((error) => {
    console.error('Error signing out: ', error);
  });
};

useEffect(() => {
  const fetchProducts = async () => {
    const firestore = getFirestore(firebase);
    const productCollection = collection(firestore, 'products');
    const productSnapshot = await getDocs(productCollection);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Insert products into PriorityQueue
    productList.forEach(product => productQueue.push(product));

    // Print PriorityQueue
    //productQueue.print();

    // Remove products from PriorityQueue and set them as state
    const sortedProducts = [];
    while (!productQueue.isEmpty()) {
      sortedProducts.push(productQueue.pop());
    }
    setProducts(sortedProducts);
  };

  fetchProducts();
}, []);

  const handleProductAdd = (product) => {
    addToCart(product, quantities[product.id] || 1);
    resetQuantities();
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: 37, // Adjust this value as needed
    bottom: 10, // Adjust this value as needed
    backgroundColor: 'red',
    borderRadius: 6,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    width: 300, // Set width
    height: 320, // Set height
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  quantityInput: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
  },
});