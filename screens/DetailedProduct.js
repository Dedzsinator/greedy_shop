import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CartContext } from '../contexts/CartContext.js';
import { AuthContext } from '../contexts/auth';
import CustomHeader from '../components/CustomHeader';


export default ProductDetail = ({ route }) => {
  const navigation = useNavigation();
  const { item } = route.params;
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { logout } = useContext(AuthContext); // Add this line

  const fadeAnimImage = useRef(new Animated.Value(0)).current;
  const fadeAnimDescription = useRef(new Animated.Value(0)).current;
  const fadeAnimPrice = useRef(new Animated.Value(0)).current;
  const fadeAnimName = useRef(new Animated.Value(0)).current;
  const fadeAnimButton = useRef(new Animated.Value(0)).current;
  const fadeAnimInput = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnimImage, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(fadeAnimDescription, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(fadeAnimPrice, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(fadeAnimName, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(fadeAnimButton, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(fadeAnimInput, { toValue: 1, duration: 1000, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogout = () => {
    logout();
  };
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <CustomHeader />,
      headerTitleAlign: 'center',
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <Text style={{ marginRight: 10 }}>User Name</Text>
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ),
    });
  }, [navigation]);

  const handleAddToCart = () => {
    addToCart(item, quantityToAdd);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Animated.Image source={{ uri: item.img }} style={{ ...styles.image, opacity: fadeAnimImage }} />
        <View style={styles.details}>
          <Animated.Text style={{ ...styles.description, opacity: fadeAnimDescription }}>{item.desc}</Animated.Text>
          <Animated.Text style={{ ...styles.price, opacity: fadeAnimPrice }}>{item.price}</Animated.Text>
          <Animated.Text style={{ ...styles.name, opacity: fadeAnimName }}>{item.name}</Animated.Text>
          <View style={styles.row}>
            <Animated.View style={{ ...styles.button, opacity: fadeAnimButton }}>
              <Button title="Add to Cart" onPress={handleAddToCart} />
            </Animated.View>
            <Animated.View style={{ opacity: fadeAnimInput }}>
              <TextInput
                style={styles.input}
                onChangeText={text => setQuantityToAdd(text)}
                value={quantityToAdd.toString()}
                placeholder="darabszám"
                keyboardType="numeric"
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  top: {
    flexDirection: 'row',
    marginBottom: 10,
    flex: 0.7, // This will take up 70% of the screen
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  details: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10, // Add padding top
  },
  button: {
    marginRight: 10, // Add margin right
  },
  description: {
    fontSize: 24,
    lineHeight: 50, // Add this line
    marginTop: 20,
    textAlign: 'center',
    flex: 1,
    width: '80%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align items vertically in the center
    padding: 10, // Add padding
  },
  price: {
    fontSize: 30, // Increase the font size
  },
  name: {
    fontWeight: 'bold',
    fontSize: 30, // Increase the font size
  },
  input: {
    width: '40%',
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
  },
});