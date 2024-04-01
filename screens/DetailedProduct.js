import React, { useState, useContext } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';
import { CartContext } from '../contexts/CartContext.js';

const ProductDetail = ({ route }) => {
  const { item } = route.params;
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart(item, quantityToAdd);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View>
          <Text>{item.name}</Text>
          <Text>{item.price}</Text>
          <TextInput
            style={styles.input}
            onChangeText={text => setQuantityToAdd(text)}
            value={quantityToAdd.toString()}
            placeholder="darabszám"
            keyboardType="numeric"
          />
          <Button title="Add to Cart" onPress={handleAddToCart} />
        </View>
      </View>
      <Text>{item.desc}</Text>
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
  },
  image: {
    width: '50%',
    height: 200,
    marginRight: 10,
  },
  input: {
    width: '50%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
});

export default ProductDetail;