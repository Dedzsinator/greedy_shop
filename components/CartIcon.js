import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CartIcon = (props) => (
  <Svg width={120} height={64} viewBox="0 0 24 24" fill="none" {...props} style={{ transform: [{ rotate: '180deg' }, { scaleX: -1 }] }}>
    <Path
      d="M2 2h1.5l3.2 7.9 1.3-3.9h9.9l1.8 5.7 2.5 2.5H6.5"
      fill="#000"
    />
    <Path d="M6.5 12.5h11" fill="#000" />
  </Svg>
);

export default CartIcon;