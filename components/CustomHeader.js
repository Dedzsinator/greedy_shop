import React from 'react';
import { View, Text } from 'react-native';

const CustomHeader = () => (
  <View>
    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Greedy Shop</Text>
    <Text style={{ fontSize: 16, textAlign: 'center' }}>Money is the root of all evil.</Text>
  </View>
);

export default CustomHeader;