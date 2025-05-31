import Svg, { Path } from 'react-native-svg';

export default function MyIcon() {
  return (
    <Svg
      fill="none"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path
        stroke="currentColor"
        strokeWidth={2}
        d="m10 14 1.972 4.93c.692 1.73 3.165 1.658 3.755-.11l4.008-12.025c.521-1.564-.966-3.051-2.53-2.53L5.18 8.273c-1.768.59-1.84 3.063-.11 3.755zm0 0 3-3"
      />
    </Svg>
  );
}
