import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Keyboard,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

interface Token {
  id: string;
  logo: string;
  name: string;
  amount: string;
  price: string;
  priceNative: string;
  symbol: string;
  buyPrice: number;
  profitPercent: number;
  totalValue: string;
}

// --- AsyncStorage helper functions ---

const TOKEN_IDS_KEY = 'TOKEN_IDS';

const getTokenIds = async (): Promise<string[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(TOKEN_IDS_KEY);
    return jsonValue ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.log(`Lỗi khi lấy danh sách token`);
    return [];
  }
};

const saveTokenIds = async (ids: string[]) => {
  try {
    await AsyncStorage.setItem(TOKEN_IDS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.log(`Lỗi khi lưu danh sách token`);
  }
};

const saveToken = async (token: Token) => {
  try {
    await AsyncStorage.setItem(`TOKEN_${token.id}`, JSON.stringify(token));
    const ids = await getTokenIds();
    if (!ids.includes(token.id)) {
      ids.push(token.id);
      await saveTokenIds(ids);
    }
  } catch (e) {
    console.log(`Lỗi khi lưu token`);
  }
};

const getToken = async (id: string): Promise<Token | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`TOKEN_${id}`);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('Lỗi khi lấy token:', e);
    return null;
  }
};

export const getAllTokens = async (): Promise<Token[]> => {
  try {
    const ids = await getTokenIds();
    const tokens: Token[] = [];

    for (const id of ids) {
      const token = await getToken(id);
      if (token) tokens.push(token);
    }

    return tokens;
  } catch (e) {
    console.error('Lỗi khi lấy tất cả token:', e);
    return [];
  }
};

const removeToken = async (id: string) => {
  try {
    await AsyncStorage.removeItem(`TOKEN_${id}`);
    let ids = await getTokenIds();
    ids = ids.filter(tokenId => tokenId !== id);
    await saveTokenIds(ids);
  } catch (e) {
    console.error('Lỗi khi xóa token:', e);
  }
};

// --- Component chính ---

const TokenList = () => {
  const [tokenName, setTokenName] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Load token đã lưu khi mở app
    const loadTokens = async () => {
      const savedTokens = await getAllTokens();
      setTokens(savedTokens);
    };
    loadTokens();
  }, []);
const handleRemoveToken = async (id: string) => {
  await removeToken(id); // gọi hàm đã có
  const updatedTokens = tokens.filter(token => token.id !== id);
  setTokens(updatedTokens); // cập nhật state
};

const fetchTokenData = async (tokenNameInput: string): Promise<Token | null> => {
  try {
    // Nếu nhập solana thì dùng API CoinGecko
    if (tokenNameInput.trim().toLowerCase() === 'solana') {
      // Kiểm tra xem token solana đã tồn tại chưa
      const alreadyExists = tokens.some(t => t.id === 'solana');
      if (alreadyExists) {
        alert('Token Solana đã được thêm trước đó!');
        return null;
      }

      // Gọi API CoinGecko lấy giá solana
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
      const data = await res.json();
      if (!data.solana || !data.solana.usd) return null;

      const priceUsd = data.solana.usd;
      const amountNum = parseFloat(tokenAmount);
      if (isNaN(amountNum)) return null;

      const totalValue = amountNum * priceUsd;

      return {
        id: 'solana',
        logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', // logo chính thức
        name: 'Solana',
        symbol: 'SOL',
        amount: tokenAmount,
        price: `$${priceUsd.toFixed(4)}`,
        priceNative: '~',
        buyPrice: priceUsd,
        totalValue: totalValue.toFixed(2),
        profitPercent: 0,
      };
    }

    // Với các token khác thì gọi Dexscreener như bình thường
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenNameInput}`);
    const json = await response.json();
    const data = json.pairs?.[0];
    if (!data) return null;

    const baseId = data.pairAddress;
    const alreadyExists = tokens.some(t => t.id.startsWith(baseId));
    if (alreadyExists) {
      alert('Token đã được thêm trước đó!');
      return null;
    }

    const priceUsd = parseFloat(data.priceUsd);
    const logo = data.info?.imageUrl || 'https://via.placeholder.com/48';
    const totalValue = parseFloat(tokenAmount) * priceUsd;

    return {
      id: `${baseId}-${Date.now()}`,
      logo,
      name: data.baseToken.name,
      symbol: data.baseToken.symbol,
      amount: tokenAmount,
      price: `$${priceUsd.toFixed(4)}`,
      priceNative: data.priceNative || '~',
      buyPrice: priceUsd,
      totalValue: totalValue.toFixed(2),
      profitPercent: 0,
    };
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
};


  const addToken = async () => {
    if (!tokenName.trim() || !tokenAmount.trim()) return;

    Keyboard.dismiss();
    setLoading(true);

    try {
      const tokenData = await fetchTokenData(tokenName);
      if (!tokenData) return;

      const currentPrice = parseFloat(tokenData.price.replace('$', ''));
      const buyPrice = tokenData.buyPrice;
      const profitPercent = ((currentPrice - buyPrice) / buyPrice) * 100;

      const newToken = {
        ...tokenData,
        profitPercent,
      };

      setTokens(prevTokens => [...prevTokens, newToken]);
      await saveToken(newToken);

      setTokenName('');
      setTokenAmount('');
    } finally {
      setLoading(false);
    }
  };

 const renderTokenItem: ListRenderItem<Token> = ({ item, index }) => (
  <View style={[styles.tokenItem, index !== 0 && styles.itemMargin]}>
    <View style={styles.tokenRow}>
      <Image source={{ uri: item.logo }} style={styles.tokenLogo} resizeMode="contain" />
      <View style={styles.tokenInfo}>
        <Text style={styles.tokenName}>{item.name} ({item.symbol})</Text>
        <Text style={styles.tokenAmount}>Số lượng: {item.amount}</Text>
      </View>
      <View style={styles.priceInfo}>
        <Text style={styles.tokenPrice}>{item.price}</Text>
        <Text style={styles.priceNative}>{item.priceNative}</Text>
        <Text
          style={[
            styles.profitPercent,
            { color: item.profitPercent >= 0 ? '#4CAF50' : '#f44336' }
          ]}
        >
          {item.profitPercent >= 0 ? '+' : ''}{item.profitPercent.toFixed(2)}%
        </Text>

        {/* Nút xoá */}
        <Button title="Xoá" color="#e53935" onPress={() => handleRemoveToken(item.id)} />
      </View>
    </View>
  </View>
);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập CA token (vd: dogecoin)"
            value={tokenName}
            onChangeText={setTokenName}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập số lượng"
            keyboardType="numeric"
            value={tokenAmount}
            onChangeText={setTokenAmount}
          />
          <Button
            title={loading ? 'Đang thêm...' : 'Thêm Token'}
            onPress={addToken}
            disabled={loading}
          />
        </View>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        <FlatList
          data={tokens}
          renderItem={renderTokenItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Chưa có token nào được thêm</Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1F1F1F',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    backgroundColor: '#1F1F1F',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: 'white',
  },
  tokenItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    elevation: 2,
  },
  itemMargin: {
    marginTop: 10,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tokenAmount: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  tokenPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  priceNative: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  profitPercent: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default TokenList;
