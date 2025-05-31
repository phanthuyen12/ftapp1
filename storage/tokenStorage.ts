


import AsyncStorage from '@react-native-async-storage/async-storage';
const TOKEN_IDS_KEY = 'TOKEN_IDS';
// export const saveTokenList = async(TokenList:any[])=>{
//     try{
//         const jsonValue = JSON.stringify(TokenList);
//         await AsyncStorage.setItem(jsonValue.id ,jsonValue)
//     }catch(e){
//         console.error(`lỗi khi lưu token vào list : `,e);
//     }
// }
export const getTokenIds = async (): Promise<string[]> => {
    try{
        const jsonValue = await AsyncStorage.getItem(TOKEN_IDS_KEY);
        return jsonValue ? JSON.parse(jsonValue):[];
    }catch(e){
    console.log(`lỗi khi lưu danh sách token`)
    return [];
    }
}
export const saveTokenIds = async (ids : string[])=>{
    try{
        await AsyncStorage.setItem(TOKEN_IDS_KEY,JSON.stringify(ids));

    }catch(e){
        console.log(`lỗi khi lưu danh sách token`)
    }
}
export const saveToken = async (token:any)=>{
    try{
        await AsyncStorage.setItem(`TOKEN_${token.id}`,JSON.stringify(token));
        const ids = await getTokenIds();
        if(!ids.includes(token.id)){
            ids.push(token.id)
        await saveTokenIds(ids);

            
        }
    }catch(e){
                console.log(`lỗi khi lưu danh sách token`)

    }
}
// Lấy tất cả token trong danh sách
export const getAllTokens = async (): Promise<any[]> => {
  try {
    const ids = await getTokenIds();
    const tokens: any[] = [];

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
export const getToken = async (id: string): Promise<any | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`TOKEN_${id}`);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Lỗi khi lấy token:', e);
    return null;
  }
};
// Xóa một token theo id
export const removeToken = async (id: string) => {
  try {
    // Xóa token theo key
    await AsyncStorage.removeItem(`TOKEN_${id}`);

    // Cập nhật danh sách id token
    let ids = await getTokenIds();
    ids = ids.filter(tokenId => tokenId !== id);
    await saveTokenIds(ids);
  } catch (e) {
    console.error('Lỗi khi xóa token:', e);
  }
};