import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, Image, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import firebase from '../firebase.js';
import { AuthContext } from '../contexts/auth.js';
import { CartContext } from '../contexts/CartContext.js';
import CartIcon from '../components/CartIcon.js';
import Cart from '../screens/Cart.js';
import { ProductDetail } from '../screens/DetailedProduct.js';

const numColumns = Math.floor(Dimensions.get('window').width / 200);

export default function HomeScreen() {

   React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <Text style={{ marginRight: 10 }}>User Name</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ),
    });
  }, [navigation]);

  const { user } = useContext(AuthContext);
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (quantity, productId) => {
    setQuantities(prevQuantities => ({ ...prevQuantities, [productId]: quantity }));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
        <Image source={{ uri: item.img }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text>{item.name}</Text>
          <Text>{item.price}</Text>
        </View>
      </TouchableOpacity>
      <TextInput
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
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Cart', { cart: cart })}>
          <CartIcon width={120} height={64} />
          {cart.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      const firestore = getFirestore(firebase);
      const productCollection = collection(firestore, 'products');
      const productSnapshot = await getDocs(productCollection);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
    };
  
    fetchProducts();
  }, []);

  const handleProductAdd = (product) => {
    addToCart(product, quantities[product.id] || 1);
  };

  const handleLogout = () => {
    navigation.navigate('Logout');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
      />
      <Button title="Logout" onPress={handleLogout} />  
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
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
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