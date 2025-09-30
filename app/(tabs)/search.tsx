import { useFonts } from 'expo-font';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function HelloScreen() {
  const [fontsLoaded] = useFonts({
    'SFProDisplay-Regular': require('../../assets/fonts/SFProDisplay-Regular.otf'),
    'SFProDisplay-Bold': require('../../assets/fonts/SFProDisplay-Bold.otf'),
    'SFProDisplay-Medium': require('../../assets/fonts/SFProDisplay-Medium.otf'),
  });

  if (!fontsLoaded) {
    return null; // hoặc custom loading view
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontFamily: 'SFProDisplay-Regular' }]}>
        Xin chào 👋
      </Text>
      <Text style={[styles.text, { fontFamily: 'SFProDisplay-Bold', fontSize: 28 }]}>
        Đây là font SF Pro Display Bold ✅
      </Text>
      <Text style={[styles.text, { fontFamily: 'SFProDisplay-Medium', fontSize: 24 }]}>
        Đây là font SF Pro Display Medium ⚡
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    color: 'white',
    marginVertical: 8,
  },
});
