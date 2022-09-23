import { View, Text, SafeAreaView, TouchableOpacity, StatusBar, Image, FlatList } from 'react-native';
import { AppHeader, GroupButton, C_Image } from '../../components';
import Colors from '../../constants/Colors';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOtherDataNft, getSearchResult } from '../../store/actions/chatAction';
import { translate } from '../../walletUtils';
import styles from './style';
import { ActivityIndicator, Searchbar } from 'react-native-paper';

const AiChat = ({ navigation }) => {
  const dispatch = useDispatch();

  //================== Components State Declaration =================== 
  const [searchTxt, setSearchTxt] = useState('');
  const [otherNft, setOtherNft] = useState([]);
  const [loading, setLoading] = useState(true);

  // =============== Getting data from reducer ======================== 
  const { chatOtherNftCollectionList, chatOtherNftCollectionLoading } = useSelector(state => state.chatReducer);
  const { userData } = useSelector(state => state.UserReducer);

  useEffect(() => {
    dispatch(getOtherDataNft(userData.userWallet.address));
    setLoading(false);
  }, []);

  const handleSearchResult = (e) => {
    dispatch(getSearchResult(e, userData.userWallet.address))
  }

  const renderItem = ({ item, index }) => {
    let metaData = item.metadata;
    let data = JSON.parse(metaData);
    return (
      <TouchableOpacity onPress={() => navigation.navigate('chatNFT', { chatNft: data, tokenId: item.token_id })}>
        <View style={{ flexDirection: 'row', backgroundColor: Colors.white, paddingVertical: 5, }}>
          <C_Image
            uri={data.image}
            imageStyle={{
              height: 40, width: 40, borderRadius: 40 / 2
            }}
          />
          <Text style={{ paddingVertical: 10, paddingStart: 10, marginLeft: 10, color: '#484848', fontWeight: '700' }}>
            {data.name.slice(data.name.lastIndexOf("#"))}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  const keyExtractor = (item, index) => { return `_${index}` }

  //=====================(Main return Function)=============================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* <AppBackground isBusy={loading}> */}

      <StatusBar barStyle='dark-content' backgroundColor={'#fff'} />
      <AppHeader
        title='Chat'
        showBackButton
      />
      <Searchbar
        style={styles.searchBar}
        placeholder="Search..."
        onChangeText={txt => { setSearchTxt(txt); handleSearchResult(txt); }}
        inputStyle={styles.inputStyle}
        value={searchTxt}
        multiline={false}
      />
      <View style={{ Height: '40%', maxHeight: '40%', }}>
        {chatOtherNftCollectionLoading ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color={'blue'} />
          </View>
          :
          chatOtherNftCollectionList.length !== 0 && !chatOtherNftCollectionLoading ? (
            <View style={{ backgroundColor: Colors.white, marginHorizontal: 10, paddingLeft: 10, }}>
              <Text style={{ paddingVertical: 10, color: '#747579', fontWeight: '500' }}>Others</Text>
              <FlatList
                showsVerticalScrollIndicator={true}
                data={chatOtherNftCollectionList}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
              />
              <GroupButton
                leftText={'More'}
                style={styles.viewAllBtn}
                leftStyle={styles.viewAllBtnInner}
                leftTextStyle={{ color: Colors.BLUE4 }}
                // onLeftPress={() => navigation.push('CollectionDetail', { item: collectCreat })}
                rightHide
              />
            </View>
          ) : (
            <View style={{ backgroundColor: Colors.white, marginHorizontal: 10, paddingLeft: 10, }}>
              <Text style={{ paddingVertical: 10, color: '#747579', fontWeight: '500' }}>Others</Text>
              <View style={styles.sorryMessageCont}>
                <Text style={styles.sorryMessage}>{translate('common.noNFTsFound')}</Text>
              </View>
            </View>
            // // <View style={{ flex: 1 }}>
            //   <View style={styles.sorryMessageCont}>
            //     <Text style={styles.sorryMessage}>{translate('common.noNFTsFound')}</Text>
            //   </View>
            // // </View>
          )
        }
      </View>

    </SafeAreaView>
  )
}

export default AiChat;

