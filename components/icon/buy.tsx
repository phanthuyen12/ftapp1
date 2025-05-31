// IconCustom.js
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function BuyIcon({ size = 24, color = 'currentColor' }) {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path
              stroke="#c6b9ff"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 1v22m5-18H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"
      />
    </Svg>
  );
}
