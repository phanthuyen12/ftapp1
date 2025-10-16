import Svg, { Rect } from 'react-native-svg';

export default function CardIcon({ size = 24, color = "#888" }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      {/* Outer card frame */}
      <Rect
        x={2}          // lùi về 2 thay vì 3
        y={4}
        width={20}     // rộng hơn
        height={16}
        rx={3}
        stroke={color}
        strokeWidth={2}
        fill="none"
      />

      {/* Small square (chip / indicator) */}
      <Rect
        x={15}         // dời sang phải 1
        y={7}
        width={4}
        height={4}
        rx={1}
        fill={color}
      />

      {/* Small horizontal line */}
      <Rect
        x={7}
        y={13}
        width={7}      // dài hơn 1
        height={2}
        rx={1}
        fill={color}
      />
    </Svg>
  );
}
