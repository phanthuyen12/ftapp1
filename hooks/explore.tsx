import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import BuyIcon from '../components/icon/buy';
import ReceiveIcon from '../components/icon/receive';
import SendIcon from '../components/icon/send';
import SwapIcon from '../components/icon/swap';
export default function TabTwoScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.leftContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://em-content.zobj.net/source/apple/391/ghost_1f47b.png',
              }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>@phanthuyen</Text>
            <Text style={styles.NameUser}>f</Text>
          </View>
        </View>

        <View style={styles.rightContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="maximize" size={wp('6%')} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Feather name="search" size={wp('6%')} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Balance ngay dưới header */}
      

      <ScrollView
        style={styles.bodyApp}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        <View style={styles.balanceContainer}>
        <Text style={styles.balance}>$63,204.02</Text>
        <Text style={styles.subBalance}>-$0.00000007 <Text style={styles.profitpercentage}>-0.00%</Text></Text>
      </View>
     <View style={styles.actions}>
  <TouchableOpacity style={styles.actionItem}>
    <ReceiveIcon/>
    <Text style={styles.actionLabel}>Receive</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.actionItem}>
    <SendIcon />
    <Text style={styles.actionLabel}>Send</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.actionItem}>
        <SwapIcon/>
    <Text style={styles.actionLabel}>Swap</Text>
  </TouchableOpacity>

  <TouchableOpacity style={styles.actionItem}>
    <BuyIcon/>
    <Text style={styles.actionLabel}>Buy</Text>
  </TouchableOpacity>
</View>

       
      <View>
  {[
            {
              logo: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
              name: 'Solana',
              amount: '12.345 SOL',
              price: '$45.67',
              profit: '+$5.67',
              profitColor: '#4caf50',
            },
            {
              logo: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
              name: 'Ethereum',
              amount: '1.234 ETH',
              price: '$3,456.78',
              profit: '-$123.45',
              profitColor: '#ff6666',
            },
            {
              logo: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
              name: 'Bitcoin',
              amount: '0.567 BTC',
              price: '$28,345.12',
              profit: '+$987.65',
              profitColor: '#4caf50',
            },
            {
              logo: 'https://assets.coingecko.com/coins/images/6319/large/Tether-logo.png',
              name: 'Tether',
              amount: '1000 USDT',
              price: '$1.00',
              profit: '+$0.00',
              profitColor: '#999999',
            },
            {
              logo: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png',
              name: 'Binance Coin',
              amount: '10 BNB',
              price: '$400.50',
              profit: '-$10.50',
              profitColor: '#ff6666',
            },
          ].map((token, index) => (
    <View key={index} style={[styles.Notification, index !== 0 && { marginTop: -10 }]}>
      <View style={styles.tokenRow}>
<Image
  source={{ uri: token.logo }}
  style={styles.tokenLogo}
  resizeMode="cover"
/>
        <View style={styles.tokenInfo}>
          <Text style={styles.tokenName}>{token.name}</Text>
          <Text style={styles.tokenAmount}>{token.amount}</Text>
        </View>
        <View style={styles.tokenPrice}>
          <Text style={styles.tokenPriceValue}>{token.price}</Text>
          <Text style={[styles.tokenProfit, { color: token.profitColor }]}>
            {token.profit}
          </Text>
        </View>
      </View>
    </View>
  ))}
</View>
<View style={styles.container}>
      <Ionicons name="options-outline" size={20} color="#ccc" style={styles.icon} />
      <Text style={styles.text}>Manage token list</Text>
    </View>
        {/* Nội dung khác bên dưới */}
      </ScrollView>
    </SafeAreaView>
  );
}
const getIcon = (label: string) => {
  switch (label) {
    case 'Receive':
      return 'qr-code-outline';
    case 'Send':
      return 'paper-plane-outline';
    case 'Swap':
      return 'swap-horizontal-outline';
    case 'Buy':
      return 'cash-outline';
    default:
      return 'alert-circle-outline';
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1, // chiếm toàn bộ màn hình
    backgroundColor: '#1e1e1e',
    justifyContent: 'center', // canh giữa theo chiều dọc
    alignItems: 'center',     // canh giữa theo chiều ngang
    flexDirection: 'row',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '400',
  },
 Notification: {
    backgroundColor: '#222',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
},
tokenRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: hp('1%'),
  borderBottomColor: '#333',
},

tokenLogo: {
  width: wp('10%'),
  height: wp('10%'),
  borderRadius: wp('5%'),  // hình tròn
  marginRight: wp('3%'),
  backgroundColor: 'white', // thêm nền trắng
},


tokenInfo: {
  flex: 1,
  justifyContent: 'center',
},

tokenName: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: wp('4.3%'),
},

tokenAmount: {
  color: '#bbb',
  fontSize: wp('3.5%'),
  marginTop: hp('0.3%'),
},

tokenPrice: {
  alignItems: 'flex-end',
  justifyContent: 'center',
  width: wp('30%'), // bạn chỉnh theo ý muốn
},

tokenPriceValue: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: wp('4%'),
},

tokenProfit: {
  fontSize: wp('3.5%'),
  marginTop: hp('0.3%'),
},

   actionLabel: {
    color: '#c6b9ff',
    marginTop: 6,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
  },
  actionItem: {
  marginTop:hp('-3%'),
  alignItems: 'center',
  backgroundColor: '#2A2A2A',
  borderRadius: wp('4%'),
  paddingVertical: hp('1.5%'),
  paddingHorizontal: wp('4%'),
  width: wp('21.1%'),
},

  safeArea: {
    flex: 1,
    backgroundColor: '#1F1F1F',
  },
  header: {
    paddingHorizontal: wp('4%'),
    paddingTop: hp('2.5%'),
    paddingBottom: hp('1.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: wp('8.5%'),
    height: wp('8.5%'),
    borderRadius: wp('4.25%'),
    borderWidth: 2,
    borderColor: '#888888',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('2.5%'),
  },
  avatar: {
    width: wp('7.5%'),
    height: wp('7.5%'),
    borderRadius: wp('3.75%'),
  },
  userInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  username: {
    color: '#ccc',
    fontWeight: 'bold',
    fontSize: wp('4.3%'),
  },
  profitpercentage: {
  paddingHorizontal: wp('1.5%'),
  paddingVertical: hp('0.3%'),
  backgroundColor: '#462624',
  borderRadius: wp('2%'),
  color: '#ff6666',
  fontSize: wp('3.5%'),
  fontWeight: '500',
  overflow: 'hidden', // đảm bảo bo góc hoạt động đúng
  marginLeft: wp('1%'),
},

  NameUser: {
    fontSize: wp('5.3%'),
    color: '#fff',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: wp('4%'),
  },
  balanceContainer: {
    marginTop: hp('-1%'),
    marginBottom: hp('2%'),
    alignItems: 'center',
  },
  balance: {
    fontSize: wp('13%'),
    color: 'white',
    fontWeight: 'bold',
  },
  subBalance: {
    color: '#ff6666',
    marginTop: hp('0.5%'),
    fontSize: wp('4%'),
  },
  bodyApp: {
    flex: 1,
    backgroundColor: '#1F1F1F',
    paddingHorizontal: wp('4%'),
  },
  scrollContent: {
    paddingBottom: hp('2%'),
  },
});
