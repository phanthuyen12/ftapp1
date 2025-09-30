import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Feather, Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const base64Icon =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABQCAYAAACeXX40AAAAAXNSR0IArs4c6QAAAyBJREFUeF7tnUFSGzEQRaXkFqFyl3AbOALJIrBIOALcBucsKXKLMCk5sauAMFLPtPw11W82LNB0y0/PX6qya5wTFwSEBLKwN60hkBAQCaQEEFCKn+YIiANSAggoxU9zBMQBKQEElOKnOQLigJQAAkrx0xwBcUBKAAGl+GmOgDggJYCAUvw0R0AckBJAQCl+miMgDkgJIKAUP80RcIEDd7c/P5Xbcnr/tfydnqYfl1/OrheUCn8LAhoVuL/99ZCmaS/gy2ua0g0i2oAiYCOvknr7xHtDvmOZnHdT+n1zefVx11g69DAEbFj+vXzTu4eGocchpGEbLQSscLr79nidc9qf9awXEtaJIeAMo7nzXh3t3xFIOE8KAf/Dp/m812phETE/nXMufA0MAV8wWbPl1nwkDRFw1pGe8h0aI+HzJSAB//HwOO/VEhAJScBXBHqc95pF5FwY+9Ecp9hyazJG35LDbsEjyMeWXD5PD3iNJF90CcMJOKJ8RwkDngkRcKQdIOfdxdWH85Gm1Hsu4QS8//449Ya6uD4CLka3mRuHFjCldPH5LFQohHqx5V2CgGNlBQKOtR4k4GDr4T4dEtAd6aqCJOAqfP43cwb0ZzpURRJwqOWI90nIWgHLZ7dzS7j06/uHmiTgWG8Q99msFbAmSO/67kDEBTkDGhcAAY3AKsMR0MgTAY3AEPA5gd5bZO/6vsuvr0YCGteABDQCIwFJQF9lfKuRgEaeJKARGAlIAvoq41uNBDTyJAGNwEhAEtBXGd9qJKCRJwloBEYCkoC+yvhWIwGNPElAIzASkAT0Vca3Gglo5EkCGoGRgCSgrzK+1eIl4MzPLLSgrSZg5/otc9zSmHACrnk0R8uTrJY8Uf8gTEv9LcnVMtdwAhYoS78yVUu/A/De9VsWditjQgpYFqc5CcsPzyz4Ka7e9bciWG2eYQWsgeH/pyGAgKfhTJc3CCAgakgJIKAUP80REAekBBBQip/mCIgDUgIIKMVPcwTEASkBBJTipzkC4oCUAAJK8dMcAXFASgABpfhpjoA4ICWAgFL8NEdAHJASQEApfpr/AUMXVmALdsz4AAAAAElFTkSuQmCC';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#c6b9ff',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <View style={{ flex: 1, backgroundColor: '#0F0F0F' }} />,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            height: 90,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            paddingTop: 10,
            backgroundColor: '#0F0F0F', // nền đen
          },
          android: {
            height: 60,
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: '#000', // nền đen
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeLine} />}
              <Image
                source={{ uri: base64Icon }}
                style={[
                  styles.icon,
                  {
                    tintColor: focused ? '#c6b9ff' : '#888',
                    // backgroundColor: '#000', // nền icon đen
                  },
                ]}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="swaps"
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeLine} />}
              <Feather name="repeat" size={28} color={color} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="times"
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeLine} />}
              <Ionicons
                name={focused ? 'time' : 'time-outline'}
                size={30}
                color={color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.iconContainer}>
              {focused && <View style={styles.activeLine} />}
              <Feather name="search" size={28} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingTop: 10,
  },
  activeLine: {
    position: 'absolute',
    top: 0,
    width: 60,
    height: 2,
    backgroundColor: '#c6b9ff',
    borderRadius: 2,
    zIndex: 10,
  },
  icon: {
    width: 88,
    height: 88,
    // backgroundColor: '#0F0F0F', // nền icon
    // borderRadius: 44, // hình tròn
  },
});
