import 'react-native';

declare module 'react-native' {
  interface Text {
    defaultProps?: Partial<Text['props']>;
  }
  interface TextInput {
    defaultProps?: Partial<TextInput['props']>;
  }

  namespace Text {
    let defaultProps: Partial<Text['props']>;
  }
  namespace TextInput {
    let defaultProps: Partial<TextInput['props']>;
  }
}
