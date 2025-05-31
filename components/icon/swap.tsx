import Svg, { Path } from 'react-native-svg';

export default function SwapIcon() {
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
              stroke="#c6b9ff"

        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 14-4 4m0 0 4 4m-4-4h11a4 4 0 0 0 4-4m-5-4 4-4m0 0-4-4m4 4H8a4 4 0 0 0-4 4"
      />
    </Svg>
  );
}
